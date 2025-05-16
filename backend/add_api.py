from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException
from google.api_core import protobuf_helpers
import time
import datetime
from PIL import Image

class google_add_api:
    def create_campaign_budget(client, customer_id, amount_micros, delivery_method):
        campaign_budget_service = client.get_service("CampaignBudgetService")
        campaign_budget_operation = client.get_type("CampaignBudgetOperation")
        campaign_budget = campaign_budget_operation.create

        campaign_budget.name = f"Budget {datetime.datetime.now()}"
        campaign_budget.amount_micros = amount_micros
        campaign_budget.delivery_method = delivery_method
        campaign_budget.explicitly_shared = False

        response = campaign_budget_service.mutate_campaign_budgets(
            customer_id=customer_id, operations=[campaign_budget_operation]
        )
        return response.results[0].resource_name


    def create_campaign(client, customer_id, campaign_name, campaign_type, campaign_status, budget_resource_name,
                        start_date, end_date):
        campaign_service = client.get_service("CampaignService")
        bidding_strategy_service = client.get_service("BiddingStrategyService")

        # Create a unique name for the Bidding Strategy using the current timestamp
        bidding_strategy_name = f"Target CPA Bidding Strategy for {campaign_name}_{int(time.time())}"

        # Create Bidding Strategy (e.g., TARGET_CPA)
        bidding_strategy = client.get_type("BiddingStrategy")
        bidding_strategy.name = bidding_strategy_name
        bidding_strategy.type = client.enums.BiddingStrategyTypeEnum.TARGET_CPA
        bidding_strategy.target_cpa.target_cpa_micros = 50000000  # Set your target CPA in micros (e.g., $50)

        # Create the Bidding Strategy
        bidding_strategy_operation = client.get_type("BiddingStrategyOperation")
        bidding_strategy_operation.create = bidding_strategy

        bidding_strategy_response = bidding_strategy_service.mutate_bidding_strategies(
            customer_id=customer_id, operations=[bidding_strategy_operation]
        )

        # Get the resource name of the created bidding strategy
        bidding_strategy_resource_name = bidding_strategy_response.results[0].resource_name

        # Create the Campaign
        campaign = client.get_type("Campaign")
        campaign.name = campaign_name
        campaign.advertising_channel_type = campaign_type
        campaign.status = campaign_status
        campaign.campaign_budget = budget_resource_name
        campaign.start_date = start_date
        campaign.end_date = end_date

        # Assign the Bidding Strategy to the Campaign
        campaign.bidding_strategy = bidding_strategy_resource_name

        # Campaign operation
        campaign_operation = client.get_type("CampaignOperation")
        campaign_operation.create = campaign

        # Create the campaign
        campaign_response = campaign_service.mutate_campaigns(
            customer_id=customer_id, operations=[campaign_operation]
        )

        campaign_resource_name = campaign_response.results[0].resource_name
        return campaign_resource_name

    def set_language_targeting(client, customer_id, campaign_resource_name, languages):
        google_ads_service = client.get_service("GoogleAdsService")
        campaign_criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        # Build the query to get language constants by name
        query = f"""
            SELECT language_constant.resource_name
            FROM language_constant
            WHERE language_constant.name IN ({','.join([f'"{language}"' for language in languages])})
        """

        # Run the query
        response = google_ads_service.search_stream(customer_id=customer_id, query=query)

        # Create operations for each language
        for batch in response:
            for row in batch.results:
                language_resource_name = row.language_constant.resource_name

                # Create the campaign criterion for the language
                language_operation = client.get_type("CampaignCriterionOperation")
                language_criterion = language_operation.create
                language_criterion.campaign = campaign_resource_name
                language_criterion.language.language_constant = language_resource_name
                operations.append(language_operation)

        if operations:
            # Apply the changes to the campaign
            campaign_criterion_service.mutate_campaign_criteria(
                customer_id=customer_id, operations=operations
            )
            return True
        else:
            return False

    def set_location_targeting(client, customer_id, campaign_resource_name, locations):
        geo_target_constant_service = client.get_service("GeoTargetConstantService")
        campaign_criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        # Retrieve geo target constants for the specified locations
        location_ids = []
        for location_name, language_code in locations:
            # Create a request for suggesting geo target constants
            gtc_request = client.get_type("SuggestGeoTargetConstantsRequest")
            gtc_request.locale = language_code  # Set the locale
            gtc_request.location_names.names.extend([location_name])  # Set location names

            # Call suggest_geo_target_constants() with the request object
            geo_target_constants = geo_target_constant_service.suggest_geo_target_constants(gtc_request)

            # Check if geo_target_constant_suggestions is available
            if geo_target_constants.geo_target_constant_suggestions:
                for suggestion in geo_target_constants.geo_target_constant_suggestions:
                    location_ids.append(suggestion.geo_target_constant.resource_name)
            else:
                print(f"Geo target constant not found for {location_name} in {language_code}.")

        # Set location targeting for the campaign
        for location_id in location_ids:
            location_operation = client.get_type("CampaignCriterionOperation")
            location_criterion = location_operation.create
            location_criterion.campaign = campaign_resource_name
            location_criterion.location.geo_target_constant = location_id
            operations.append(location_operation)

        if operations:
            campaign_criterion_service.mutate_campaign_criteria(
                customer_id=customer_id, operations=operations
            )
            return True
        else:
            return False

    def set_ad_rotation(client, customer_id, campaign_resource_name, optimize):
        def update_campaign(client, customer_id, campaign_resource_name, updates):
            campaign_service = client.get_service("CampaignService")
            campaign_operation = client.get_type("CampaignOperation")
            campaign = campaign_operation.update

            campaign.resource_name = campaign_resource_name
            for field, value in updates.items():
                setattr(campaign, field, value)

            client.copy_from(
                campaign_operation.update_mask,
                protobuf_helpers.field_mask(None, campaign._pb),
            )

            campaign_service.mutate_campaigns(
                customer_id=customer_id, operations=[campaign_operation]
            )
        update_campaign(
            client,
            customer_id,
            campaign_resource_name,
            {
                "ad_serving_optimization_status": (
                    client.enums.AdServingOptimizationStatusEnum.OPTIMIZE
                    if optimize
                    else client.enums.AdServingOptimizationStatusEnum.ROTATE
                )
            },
        )


    def add_device_targeting(client, customer_id, campaign_resource_name, devices):
        campaign_criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        for device in devices:
            device_operation = client.get_type("CampaignCriterionOperation")
            device_criterion = device_operation.create
            device_criterion.campaign = campaign_resource_name
            device_criterion.device.type = device
            operations.append(device_operation)

        campaign_criterion_service.mutate_campaign_criteria(
            customer_id=customer_id, operations=operations
        )


    def set_ad_schedules(client, customer_id, campaign_resource_name, schedules):
        campaign_criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        for schedule in schedules:
            schedule_operation = client.get_type("CampaignCriterionOperation")
            ad_schedule = schedule_operation.create.ad_schedule

            ad_schedule.day_of_week = schedule["day_of_week"]
            ad_schedule.start_hour = schedule["start_hour"]
            ad_schedule.end_hour = schedule["end_hour"]
            ad_schedule.start_minute = schedule["start_minute"]
            ad_schedule.end_minute = schedule["end_minute"]

            schedule_operation.create.campaign = campaign_resource_name
            operations.append(schedule_operation)

        campaign_criterion_service.mutate_campaign_criteria(
            customer_id=customer_id, operations=operations
        )


    def set_network_settings(client, customer_id, campaign_resource_name, target_search, target_display, target_partner):
        campaign_service = client.get_service("CampaignService")
        campaign_operation = client.get_type("CampaignOperation")
        campaign = campaign_operation.update

        campaign.resource_name = campaign_resource_name
        campaign.network_settings.target_google_search = target_search
        campaign.network_settings.target_content_network = target_display
        campaign.network_settings.target_partner_search_network = target_partner

        # Generate update mask
        client.copy_from(
            campaign_operation.update_mask,
            protobuf_helpers.field_mask(None, campaign._pb),
        )

        campaign_service.mutate_campaigns(
            customer_id=customer_id, operations=[campaign_operation]
        )


    def add_device_targeting(client, customer_id, campaign_resource_name, devices):
        campaign_criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        for device in devices:
            device_operation = client.get_type("CampaignCriterionOperation")
            device_criterion = device_operation.create
            device_criterion.campaign = campaign_resource_name
            device_criterion.device.type = device
            operations.append(device_operation)

        campaign_criterion_service.mutate_campaign_criteria(
            customer_id=customer_id, operations=operations
        )


    def set_ad_schedules(client, customer_id, campaign_resource_name, schedules):
        campaign_criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        for schedule in schedules:
            schedule_operation = client.get_type("CampaignCriterionOperation")
            ad_schedule = schedule_operation.create.ad_schedule

            ad_schedule.day_of_week = schedule["day_of_week"]
            ad_schedule.start_hour = schedule["start_hour"]
            ad_schedule.end_hour = schedule["end_hour"]
            ad_schedule.start_minute = schedule["start_minute"]
            ad_schedule.end_minute = schedule["end_minute"]

            schedule_operation.create.campaign = campaign_resource_name
            operations.append(schedule_operation)

        campaign_criterion_service.mutate_campaign_criteria(
            customer_id=customer_id, operations=operations
        )


    def set_content_exclusions(client, customer_id, campaign_resource_name, exclusion_type):
        # Set content exclusions
        campaign_criterion_service = client.get_service("CampaignCriterionService")
        content_exclusion_operation = client.get_type("CampaignCriterionOperation")
        content_exclusion = content_exclusion_operation.create

        content_exclusion.negative = True  # Exclusion is negative
        content_exclusion.campaign = campaign_resource_name
        content_exclusion.content_label.type = getattr(client.enums.ContentLabelTypeEnum, exclusion_type)

        # Apply the exclusion
        campaign_criterion_service.mutate_campaign_criteria(
            customer_id=customer_id, operations=[content_exclusion_operation]
        )
        print(f"Content exclusion '{exclusion_type}' applied successfully.")


    def set_campaign_url_options(client, customer_id, campaign_resource_name, tracking_template, custom_parameters):
        def update_campaign(client, customer_id, campaign_resource_name, updates):
            campaign_service = client.get_service("CampaignService")
            campaign_operation = client.get_type("CampaignOperation")
            campaign = campaign_operation.update

            campaign.resource_name = campaign_resource_name
            for field, value in updates.items():
                setattr(campaign, field, value)

            client.copy_from(
                campaign_operation.update_mask,
                protobuf_helpers.field_mask(None, campaign._pb),
            )

            campaign_service.mutate_campaigns(
                customer_id=customer_id, operations=[campaign_operation]
            )
        # Set campaign URL options
        update_campaign(
            client,
            customer_id,
            campaign_resource_name,
            {
                "tracking_url_template": tracking_template,
                "url_custom_parameters": [
                    {"key": param_key, "value": param_value}
                    for param_key, param_value in custom_parameters.items()
                ],
            },
        )
        print(f"Campaign URL options set with tracking template: {tracking_template}")


    def resize_image(input_path, output_path, size):
        img = Image.open(input_path)
        img = img.resize(size)
        img.save(output_path)
        print(f"Resized image saved as {output_path}, new size: {size}")


    def create_ad_group(client, customer_id, campaign_resource_name, name, status, ad_group_type):
        ad_group_service = client.get_service("AdGroupService")
        ad_group_operation = client.get_type("AdGroupOperation")
        ad_group = ad_group_operation.create

        ad_group.name = name
        ad_group.status = status
        ad_group.campaign = campaign_resource_name
        ad_group.type = ad_group_type

        response = ad_group_service.mutate_ad_groups(
            customer_id=customer_id, operations=[ad_group_operation]
        )
        return response.results[0].resource_name


    def create_image_asset(client, customer_id, image_path, asset_name):
        asset_service = client.get_service("AssetService")
        def load_image(image_path):
            with open(image_path, "rb") as image_file:
                return image_file.read()

        image_data = load_image(image_path)
        image_asset_operation = client.get_type("AssetOperation")
        image_asset = image_asset_operation.create
        image_asset.type = client.enums.AssetTypeEnum.IMAGE
        image_asset.name = asset_name
        image_asset.image_asset.data = image_data

        image_asset_response = asset_service.mutate_assets(
            customer_id=customer_id, operations=[image_asset_operation]
        )
        return image_asset_response.results[0].resource_name


    def create_responsive_display_ad(client, customer_id, ad_group_resource_name, headlines, descriptions, final_urls,business_name, square_image_asset_resource_name, landscape_image_asset_resource_name):
        ad_group_ad_service = client.get_service("AdGroupAdService")
        ad_group_ad_operation = client.get_type("AdGroupAdOperation")
        ad_group_ad = ad_group_ad_operation.create
        ad_group_ad.ad_group = ad_group_resource_name
        ad_group_ad.status = client.enums.AdGroupAdStatusEnum.PAUSED
        ad = ad_group_ad.ad

        for final_url in final_urls:
            ad.final_urls.append(final_url)  # Correct URL
        ad.responsive_display_ad.business_name = business_name

        # Add headlines
        for headline_text in headlines:
            headline = client.get_type("AdTextAsset")
            headline.text = headline_text
            ad.responsive_display_ad.headlines.append(headline)

        # Add long headline
        ad.responsive_display_ad.long_headline.text = "Transform with AI Tech"

        # Add descriptions
        for description_text in descriptions:
            description = client.get_type("AdTextAsset")
            description.text = description_text
            ad.responsive_display_ad.descriptions.append(description)

        # Add call-to-action text
        ad.responsive_display_ad.call_to_action_text = "Learn More"

        # Add images
        ad_image_asset_square = client.get_type("AdImageAsset")
        ad_image_asset_square.asset = square_image_asset_resource_name
        ad.responsive_display_ad.square_marketing_images.append(ad_image_asset_square)

        ad_image_asset_landscape = client.get_type("AdImageAsset")
        ad_image_asset_landscape.asset = landscape_image_asset_resource_name
        ad.responsive_display_ad.marketing_images.append(ad_image_asset_landscape)

        # Add the ad to the ad group
        ad_group_ad_response = ad_group_ad_service.mutate_ad_group_ads(
            customer_id=customer_id, operations=[ad_group_ad_operation]
        )
        ad_group_ad_resource_name = ad_group_ad_response.results[0].resource_name
        print(f"Created Ad with resource name: {ad_group_ad_resource_name}")






















    #####test####
