# from google.ads.googleads.client import GoogleAdsClient
# from google.ads.googleads.errors import GoogleAdsException
# import json
#
#
# def set_user_interest_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
#                                 taxonomy_type: str, audience_search_term: str, segments: list[str]) -> bool:
#     """
#     Exclude specified user interest segments from a campaign.
#     - taxonomy_type: 'AFFINITY' or 'IN_MARKET'
#     - audience_search_term: filter segments by keyword (or None)
#     - segments: list of segment names to exclude
#     """
#     ga_service = client.get_service("GoogleAdsService")
#     criterion_service = client.get_service("CampaignCriterionService")
#     ops = []
#
#     # Build and run query to fetch matching user_interest constants
#     query = (
#         f"SELECT user_interest.resource_name, user_interest.name "
#         f"FROM user_interest "
#         f"WHERE user_interest.taxonomy_type = '{taxonomy_type}'"
#     )
#     if audience_search_term:
#         safe = audience_search_term.replace("'", "\\'")
#         query += f" AND user_interest.name LIKE '%{safe}%'"
#     response = ga_service.search_stream(customer_id=customer_id, query=query)
#
#     # Map names to resource names
#     name_to_res = {}
#     for batch in response:
#         for row in batch.results:
#             name_to_res[row.user_interest.name] = row.user_interest.resource_name
#
#     # Build exclusion operations
#     for name in segments:
#         res = name_to_res.get(name)
#         if not res:
#             print(f"Skipping user_interest not found: {name}")
#             continue
#         op = client.get_type("CampaignCriterionOperation")
#         crit = op.create
#         crit.campaign = campaign_resource
#         crit.negative = True
#         crit.user_interest.user_interest = res
#         ops.append(op)
#
#     if not ops:
#         return False
#     criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
#     return True
#
#
# def set_topic_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
#                          topics_search_term: str, topics: list[str]) -> bool:
#     """
#     Exclude specified topic paths from a campaign.
#     - topics_search_term: filter by keyword (or None)
#     - topics: list of full topic path strings to exclude
#     """
#     ga_service = client.get_service("GoogleAdsService")
#     criterion_service = client.get_service("CampaignCriterionService")
#     ops = []
#
#     # Fetch topic constants
#     query = "SELECT topic_constant.resource_name, topic_constant.path FROM topic_constant"
#     if topics_search_term:
#         safe = topics_search_term.replace("'", "\\'")
#         query += f" WHERE topic_constant.path CONTAINS '{safe}'"
#     response = ga_service.search_stream(customer_id=customer_id, query=query)
#
#     # Map path strings to resource names
#     path_to_res = {}
#     for batch in response:
#         for row in batch.results:
#             path = "/".join(row.topic_constant.path)
#             path_to_res[path] = row.topic_constant.resource_name
#
#     # Build exclusion operations
#     for path in topics:
#         res = path_to_res.get(path)
#         if not res:
#             print(f"Skipping topic path not found: {path}")
#             continue
#         op = client.get_type("CampaignCriterionOperation")
#         crit = op.create
#         crit.campaign = campaign_resource
#         crit.negative = True
#         crit.topic.topic_constant = res
#         ops.append(op)
#
#     if not ops:
#         return False
#     criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
#     return True
#
#
# def set_placement_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
#                              placements: list[str]) -> bool:
#     """
#     Exclude specified placement URLs from a campaign.
#     """
#     if not placements:
#         return False
#     criterion_service = client.get_service("CampaignCriterionService")
#     ops = []
#     for url in placements:
#         op = client.get_type("CampaignCriterionOperation")
#         crit = op.create
#         crit.campaign = campaign_resource
#         crit.negative = True
#         crit.placement.url = url
#         ops.append(op)
#     criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
#     return True
#
#
# def set_demographic_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
#                                gender_excl: list[str], age_excl: list[str],
#                                parental_excl: list[str], income_excl: list[str]) -> bool:
#     """
#     Exclude demographic categories from a campaign.
#     """
#     criterion_service = client.get_service("CampaignCriterionService")
#     enums = client.enums
#     ops = []
#
#     # Gender exclusions
#     for g in gender_excl:
#         try:
#             val = getattr(enums.GenderTypeEnum, g.upper())
#         except AttributeError:
#             print(f"Skipping invalid gender: {g}")
#             continue
#         op = client.get_type("CampaignCriterionOperation")
#         crit = op.create
#         crit.campaign = campaign_resource
#         crit.negative = True
#         crit.gender.type = val
#         ops.append(op)
#
#     # Age range exclusions
#     for a in age_excl:
#         key = a.replace('-', '_').replace('+', 'PLUS')
#         try:
#             val = getattr(enums.AgeRangeTypeEnum, f"AGE_RANGE_{key}")
#         except AttributeError:
#             print(f"Skipping invalid age range: {a}")
#             continue
#         op = client.get_type("CampaignCriterionOperation")
#         crit = op.create
#         crit.campaign = campaign_resource
#         crit.negative = True
#         crit.age_range.type = val
#         ops.append(op)
#
#     # Parental status exclusions
#     for p in parental_excl:
#         try:
#             val = getattr(enums.ParentalStatusTypeEnum, p.replace(' ', '_').upper())
#         except AttributeError:
#             print(f"Skipping invalid parental status: {p}")
#             continue
#         op = client.get_type("CampaignCriterionOperation")
#         crit = op.create
#         crit.campaign = campaign_resource
#         crit.negative = True
#         crit.parental_status.type = val
#         ops.append(op)
#
#     # Income range exclusions
#     for inc in income_excl:
#         key = inc.replace('%', '').replace('-', '_').replace('+', 'PLUS')
#         try:
#             val = getattr(enums.IncomeRangeTypeEnum, f"INCOME_RANGE_{key}")
#         except AttributeError:
#             print(f"Skipping invalid income range: {inc}")
#             continue
#         op = client.get_type("CampaignCriterionOperation")
#         crit = op.create
#         crit.campaign = campaign_resource
#         crit.negative = True
#         crit.income_range.type = val
#         ops.append(op)
#
#     if not ops:
#         return False
#     criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
#     return True
#
#
# def recommend_and_test_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str, website_url: str):
#     """
#     Analyze website content (placeholder) to build exclusion criteria and test all functions with dummy data.
#     """
#     # Placeholder for real content analysis
#     # Example dummy recommendations:
#     data = {
#         "taxonomy_type": "IN_MARKET",
#         "audience_search_term": "ai solution",
#         "segments": ["deep learning", "chatbot"],
#         "topics_search_term": ["technology"],
#         "topics": ["innovation with ai"],
#         "placement_exclusions": ["https://endevsols.com/"],
#         "gender_exclusions": ["Male", "Female"],
#         "age_range_exclusions": ["25-34", "35-44"],
#         "parental_status_exclusions": ["Not a parent"],
#         "income_range_exclusions": ["70-80%", "80-90%"]
#     }
#
#     # Run tests
#     print("Testing user interest exclusions:",
#           set_user_interest_exclusions(client, customer_id, campaign_resource,
#                                       data["taxonomy_type"], data["audience_search_term"], data["segments"]))
#     print("Testing topic exclusions:",
#           set_topic_exclusions(client, customer_id, campaign_resource,
#                                data["topics_search_term"], data["topics"]))
#     print("Testing placement exclusions:",
#           set_placement_exclusions(client, customer_id, campaign_resource,
#                                    data["placement_exclusions"]))
#     print("Testing demographic exclusions:",
#           set_demographic_exclusions(client, customer_id, campaign_resource,
#                                      data["gender_exclusions"], data["age_range_exclusions"],
#                                      data["parental_status_exclusions"], data["income_range_exclusions"]))
#
#     # Output the recommendation JSON
#     print("Dummy recommendation JSON:")
#     print(json.dumps(data, indent=2))


from google.ads.googleads.client import GoogleAdsClient
from google.api_core import protobuf_helpers


class GoogleAdsTargetingModule:
    @staticmethod
    def set_audience_targeting(client: GoogleAdsClient,
                               customer_id: str,
                               campaign_resource_name: str,
                               audience_names: list[str]) -> bool:
        """
        Target people using Audience Segments (in-market, affinity, custom, similar, remarketing).
        audience_names: list of audience segment names as strings.
        """
        google_ads_service = client.get_service("GoogleAdsService")
        criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        # Fetch resource names for given audience segments
        query = f"""
            SELECT audience_constant.resource_name
            FROM audience_constant
            WHERE audience_constant.name IN ({', '.join([f'\"{name}\"' for name in audience_names])})
        """
        response = google_ads_service.search_stream(customer_id=customer_id, query=query)
        for batch in response:
            for row in batch.results:
                audience_resource = row.audience_constant.resource_name
                op = client.get_type("CampaignCriterionOperation")
                crit = op.create
                crit.campaign = campaign_resource_name
                crit.audience.audience_constant = audience_resource
                operations.append(op)

        if operations:
            criterion_service.mutate_campaign_criteria(
                customer_id=customer_id,
                operations=operations
            )
            return True
        return False

    @staticmethod
    def set_demographic_targeting(client: GoogleAdsClient,
                                  customer_id: str,
                                  campaign_resource_name: str,
                                  age_ranges: list[str],
                                  genders: list[str],
                                  parental_statuses: list[str],
                                  income_tiers: list[str]) -> bool:
        """
        Limit ads by demographics: age, gender, parental status, income.
        Each list item corresponds to enum names in API (e.g., 'AGE_RANGE_25_34', 'GENDER_FEMALE').
        """
        criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        # Age ranges
        for age in age_ranges:
            op = client.get_type("CampaignCriterionOperation")
            crit = op.create
            crit.campaign = campaign_resource_name
            crit.age_range.type = getattr(client.enums.AgeRangeTypeEnum, age)
            operations.append(op)

        # Genders
        for gender in genders:
            op = client.get_type("CampaignCriterionOperation")
            crit = op.create
            crit.campaign = campaign_resource_name
            crit.gender.type = getattr(client.enums.GenderTypeEnum, gender)
            operations.append(op)

        # Parental status
        for status in parental_statuses:
            op = client.get_type("CampaignCriterionOperation")
            crit = op.create
            crit.campaign = campaign_resource_name
            crit.parental_status.type = getattr(client.enums.ParentalStatusTypeEnum, status)
            operations.append(op)

        # Income tiers
        for tier in income_tiers:
            op = client.get_type("CampaignCriterionOperation")
            crit = op.create
            crit.campaign = campaign_resource_name
            crit.income_range.type = getattr(client.enums.IncomeRangeTypeEnum, tier)
            operations.append(op)

        if operations:
            criterion_service.mutate_campaign_criteria(
                customer_id=customer_id,
                operations=operations
            )
            return True
        return False

    @staticmethod
    def set_keyword_targeting(client: GoogleAdsClient,
                              customer_id: str,
                              campaign_resource_name: str,
                              keywords: list[str]) -> bool:
        """
        Contextual targeting: target pages/apps with given keywords (content mode).
        """
        criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        for kw in keywords:
            op = client.get_type("CampaignCriterionOperation")
            crit = op.create
            crit.campaign = campaign_resource_name
            crit.keyword.text = kw
            crit.keyword.match_type = client.enums.KeywordMatchTypeEnum.BROAD
            operations.append(op)

        if operations:
            criterion_service.mutate_campaign_criteria(
                customer_id=customer_id,
                operations=operations
            )
            return True
        return False

    @staticmethod
    def set_topic_targeting(client: GoogleAdsClient,
                            customer_id: str,
                            campaign_resource_name: str,
                            topic_names: list[str]) -> bool:
        """
        Broadly target predefined categories (topics).
        topic_names: list of topic constant names like 'TOPIC_BUSINESS_AND_INDUSTRIAL'.
        """
        google_ads_service = client.get_service("GoogleAdsService")
        criterion_service = client.get_service("CampaignCriterionService")
        operations = []

        # Fetch topic constant resource names
        query = f"""
            SELECT topic_constant.resource_name
            FROM topic_constant
            WHERE topic_constant.topic_constant IN ({', '.join([f'\"{t}\"' for t in topic_names])})
        """
        response = google_ads_service.search_stream(customer_id=customer_id, query=query)
        for batch in response:
            for row in batch.results:
                topic_res = row.topic_constant.resource_name
                op = client.get_type("CampaignCriterionOperation")
                crit = op.create
                crit.campaign = campaign_resource_name
                crit.topic.topic_constant = topic_res
                operations.append(op)

        if operations:
            criterion_service.mutate_campaign_criteria(
                customer_id=customer_id,
                operations=operations
            )
            return True
        return False

    @staticmethod
    def set_placement_targeting(client: GoogleAdsClient,
                                customer_id: str,
                                campaign_resource_name: str,
                                placements: list[str]) -> bool:
        """
        Manually target placements: website URLs, YouTube channels/videos, mobile apps.
        """
        criterion_service = client.get_service("CampaignCriterionService")
        operations = []
        for placement in placements:
            op = client.get_type("CampaignCriterionOperation")
            crit = op.create
            crit.campaign = campaign_resource_name
            if placement.startswith("http"):
                crit.placement.url = placement
            elif placement.startswith("UC") or placement.startswith("UC-"):
                crit.youtube_channel.channel_id = placement
            elif placement.startswith("-"):
                crit.youtube_video.video_id = placement.lstrip('-')
            else:
                crit.mobile_app.app_id = placement
            operations.append(op)

        if operations:
            criterion_service.mutate_campaign_criteria(
                customer_id=customer_id,
                operations=operations
            )
            return True
        return False

    @staticmethod
    def disable_optimized_targeting(client: GoogleAdsClient,
                                    customer_id: str,
                                    campaign_resource_name: str) -> None:
        """
        Turn OFF optimized targeting to enforce only manual selections.
        """
        campaign_service = client.get_service("CampaignService")
        op = client.get_type("CampaignOperation")
        camp = op.update
        camp.resource_name = campaign_resource_name
        camp.optimized_targeting_setting.optimized_targeting = False
        client.copy_from(
            op.update_mask,
            protobuf_helpers.field_mask(None, camp._pb)
        )
        campaign_service.mutate_campaigns(
            customer_id=customer_id,
            operations=[op]
        )


if __name__ == "__main__":
    # Load client and define IDs
    client = GoogleAdsClient.load_from_storage(version="v18")
    customer_id = "9115365119"
    campaign_id = "22493939001"
    # Format the campaign resource name
    campaign_resource = f"customers/{customer_id}/campaigns/{campaign_id}"

    # 1. Audience Targeting
    audiences = [
        "Technology", "AI Chatbot", "Machine Learning",
        "Business Professionals", "CRM Solutions"
    ]
    success = GoogleAdsTargetingModule.set_audience_targeting(
        client, customer_id, campaign_resource, audiences
    )
    print("Audience targeting applied:", success)

    # 2. Demographic Targeting
    ages = ["AGE_RANGE_25_34", "AGE_RANGE_35_44", "AGE_RANGE_45_54"]
    genders = ["GENDER_MALE", "GENDER_FEMALE"]
    parental = ["PARENTAL_STATUS_NOT_A_PARENT"]
    incomes = ["INCOME_RANGE_TOP_50_PERCENT"]
    success = GoogleAdsTargetingModule.set_demographic_targeting(
        client, customer_id, campaign_resource, ages, genders, parental, incomes
    )
    print("Demographic targeting applied:", success)

    # 3. Keyword Contextual Targeting
    keywords = [
        "innovation", "business innovation",
        "AI chatbot", "tech innovation", "product innovation"
    ]
    success = GoogleAdsTargetingModule.set_keyword_targeting(
        client, customer_id, campaign_resource, keywords
    )
    print("Keyword targeting applied:", success)

    # 4. Topic Targeting
    topics = [
        "TOPIC_BUSINESS_AND_INDUSTRIAL",
        "TOPIC_COMPUTERS_AND_ELECTRONICS",
        "TOPIC_SCIENCE", "TOPIC_INTERNET_AND_TELECOM"
    ]
    success = GoogleAdsTargetingModule.set_topic_targeting(
        client, customer_id, campaign_resource, topics
    )
    print("Topic targeting applied:", success)

    # 5. Placement Targeting
    placements = [
        "https://techcrunch.com", "https://wired.com",
        "UC-CHANNEL_ID_EXAMPLE", "-VIDEO_ID_EXAMPLE", "com.example.app"
    ]
    success = GoogleAdsTargetingModule.set_placement_targeting(
        client, customer_id, campaign_resource, placements
    )
    print("Placement targeting applied:", success)

    # 6. Disable Optimized Targeting
    GoogleAdsTargetingModule.disable_optimized_targeting(
        client, customer_id, campaign_resource
    )
    print("Optimized targeting disabled.")

