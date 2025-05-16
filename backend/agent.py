from groq import Groq
import json
import time
import datetime
from audience import (
    set_user_interest_exclusions,
    set_topic_exclusions,
    set_placement_exclusions,
    set_demographic_exclusions,
)

class Marketing_Agent:
    def __init__(self, client, model, google_add_api, ai_recommender):
        self.client = client
        self.model = model
        self.googleadd = google_add_api
        self.ai_recommender = ai_recommender

    def create_campaign_budget_agent(self, question):
        # Define system messages and tools
        messages = [
            {"role": "system",
             "content": f"You are a helpful assistant to ask user to provide amount and then call the create_compaign_budget method. IF there is not maount then call method. Ask user to provide it."},
            {"role": "user", "content": f"{question}"},
        ]

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "create_campaign_budget",
                    "description": "create a budget comapign here",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "amount_micros": {
                                "type": "string",
                                "description": "here you will provide the amount micros here is format 1 USD (or 1 other currency unit) = 1,000,000 micros. 1micro = 0.000001 USD. ",
                            }
                        },
                        "required": ["amount_micros"],
                    },
                },
            },
        ]

        # Make the initial request
        response = self.client.chat.completions.create(
            model=self.model, messages=messages, tools=tools, tool_choice="auto", max_tokens=4096
        )
        return response

    def create_campaign_agent(self, question):
        # Define system messages and tools for collecting campaign details
        messages = [
            {
                "role": "system",
                "content": (
                    "You are an assistant that needs to gather two pieces of information to create a campaign: "
                    "the campaign name and the campaign duration in days. "
                    "If the user's input does not include either, ask a follow‐up question to obtain it. "
                    "Once both values are provided, call the create_campaign function with parameters "
                    "`campaign_name` (string) and `time_duration` (integer)."
                )
            },
            {"role": "user", "content": question},
        ]

        tools = [
            {
                "type": "function",
                "function": {
                    "name": "create_campaign",
                    "description": "Create a campaign with the given name and duration.",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "campaign_name": {
                                "type": "string",
                                "description": "The name of the campaign."
                            },
                            "time_duration": {
                                "type": "integer",
                                "description": "Duration of the campaign in days."
                            },
                        },
                        "required": ["campaign_name", "time_duration"]
                    }
                }
            },
        ]

        # Send to LLM
        response = self.client.chat.completions.create(
            model=self.model,
            messages=messages,
            tools=tools,
            tool_choice="auto",
            max_tokens=4096,
        )
        return response

    def run(self, question, agent):
        # Budgeting state
        if agent.state == 'budgeting':
            response = self.create_campaign_budget_agent(question)

        # Campaign creation state
        elif agent.state == 'start_campaign':
            response = self.create_campaign_agent(question)

        # Location & language targeting state
        elif agent.state == 'setting_location_language':
            loc_resp = self.ai_recommender.recommend_locations(agent.link)
            agent.locations = [(loc[0], loc[1]) for loc in loc_resp['locations']]
            agent.language = loc_resp['language']
            self.googleadd.set_location_targeting(
                agent.client, agent.customer_id,
                agent.campaign_resource_name, agent.locations
            )
            self.googleadd.set_language_targeting(
                agent.client, agent.customer_id,
                agent.campaign_resource_name, agent.language
            )
            self.googleadd.set_ad_rotation(
                agent.client, agent.customer_id,
                agent.campaign_resource_name, optimize=True
            )
            agent.state = 'add_scheduling_and_devices'
            agent.response = "Location and language set; applying audience targeting."
            return agent

        # # Audience targeting state
        # elif agent.state == 'audience_targeting':
        #     # Recommend audience criteria
        #     criteria = self.ai_recommender.recommend_audience(agent.link)
        #     # Validate and default missing keys
        #     defaults = {
        #         'taxonomy_type': None,
        #         'audience_search_term': None,
        #         'segments': [],
        #         'topics_search_term': None,
        #         'topics': [],
        #         'placement_exclusions': [],
        #         'gender_exclusions': [],
        #         'age_range_exclusions': [],
        #         'parental_status_exclusions': [],
        #         'income_range_exclusions': []
        #     }
        #     for key, default in defaults.items():
        #         criteria.setdefault(key, default)
        #     # Apply each exclusion type
        #     set_user_interest_exclusions(
        #         agent.client, agent.customer_id,
        #         agent.campaign_resource_name,
        #         criteria['taxonomy_type'],
        #         criteria['audience_search_term'],
        #         criteria['segments']
        #     )
        #     set_topic_exclusions(
        #         agent.client, agent.customer_id,
        #         agent.campaign_resource_name,
        #         criteria['topics_search_term'],
        #         criteria['topics']
        #     )
        #     set_placement_exclusions(
        #         agent.client, agent.customer_id,
        #         agent.campaign_resource_name,
        #         criteria['placement_exclusions']
        #     )
        #     set_demographic_exclusions(
        #         agent.client, agent.customer_id,
        #         agent.campaign_resource_name,
        #         criteria['gender_exclusions'],
        #         criteria['age_range_exclusions'],
        #         criteria['parental_status_exclusions'],
        #         criteria['income_range_exclusions']
        #     )
        #     agent.state = 'add_scheduling_and_devices'
        #     agent.response = "Audience targeting applied; moving to scheduling and devices."
        #     return agent
        # elif agent.state == 'audience_targeting':
        #     # 1) Get recommended audience criteria
        #     criteria = self.ai_recommender.recommend_audience(agent.link)
        #
        #     # ← NEW: store it so you can inspect it later
        #     agent.applied_audience_criteria = criteria
        #
        #     # 2) Default‐fill any missing keys
        #     defaults = {
        #         'taxonomy_type': None,
        #         'audience_search_term': None,
        #         'segments': [],
        #         'topics_search_term': None,
        #         'topics': [],
        #         'placement_exclusions': [],
        #         'gender_exclusions': [],
        #         'age_range_exclusions': [],
        #         'parental_status_exclusions': [],
        #         'income_range_exclusions': []
        #     }
        #     for k, v in defaults.items():
        #         criteria.setdefault(k, v)
        #
        #     # 3) Apply each type of exclusion
        #     set_user_interest_exclusions(
        #         agent.client, agent.customer_id, agent.campaign_resource_name,
        #         criteria['taxonomy_type'],
        #         criteria['audience_search_term'],
        #         criteria['segments']
        #     )
        #     set_topic_exclusions(
        #         agent.client, agent.customer_id, agent.campaign_resource_name,
        #         criteria['topics_search_term'],
        #         criteria['topics']
        #     )
        #     set_placement_exclusions(
        #         agent.client, agent.customer_id, agent.campaign_resource_name,
        #         criteria['placement_exclusions']
        #     )
        #     set_demographic_exclusions(
        #         agent.client, agent.customer_id, agent.campaign_resource_name,
        #         criteria['gender_exclusions'],
        #         criteria['age_range_exclusions'],
        #         criteria['parental_status_exclusions'],
        #         criteria['income_range_exclusions']
        #     )
        #
        #     agent.state = 'add_scheduling_and_devices'
        #     agent.response = "Audience targeting applied; moving to scheduling and devices."
        #     return agent


        # Scheduling & device state
        elif agent.state == 'add_scheduling_and_devices':
            resp = self.ai_recommender.recommend_schedules_device(agent.link, agent.locations)
            # Process devices
            agent.devices = []
            for d in resp.get('device', []):
                try:
                    agent.devices.append(getattr(agent.client.enums.DeviceEnum, d.upper()))
                except AttributeError:
                    continue
            # Process schedules
            agent.schedules = []
            for sch in resp.get('ad_schedule', []):
                try:
                    day = getattr(agent.client.enums.DayOfWeekEnum, sch['day_of_week'].upper())
                    agent.schedules.append({
                        'day_of_week': day,
                        'start_hour': sch['start_hour'],
                        'end_hour': sch['end_hour'],
                        'start_minute': agent.client.enums.MinuteOfHourEnum.ZERO,
                        'end_minute': agent.client.enums.MinuteOfHourEnum.ZERO
                    })
                except AttributeError:
                    continue
            self.googleadd.add_device_targeting(
                agent.client, agent.customer_id,
                agent.campaign_resource_name, agent.devices
            )
            self.googleadd.set_ad_schedules(
                agent.client, agent.customer_id,
                agent.campaign_resource_name, agent.schedules
            )
            self.googleadd.set_content_exclusions(
                agent.client, agent.customer_id,
                agent.campaign_resource_name, 'PARKED_DOMAIN'
            )
            agent.state = 'set_image_and_group'
            agent.response = "Scheduling, devices, and content exclusions applied; proceeding."
            return agent

        # Image & ad setup state
        elif agent.state == 'set_image_and_group':
            resp = self.ai_recommender.recommend_campaign_elements(agent.link)
            agent.business_name = resp['business_name']
            agent.headlines = resp['headlines'][:5]
            agent.descriptions = resp['descriptions'][:5]
            agent.tracking_template = (
                f"{agent.link[0]}?source={{network}}&campaignid={{campaignid}}"
                "&adgroupid={adgroupid}&keyword={keyword}&lpurl={lpurl}"
            )
            agent.custom_parameters = {
                'source': 'display_network',
                'campaignid': '{campaignid}',
                'adgroupid': '{adgroupid}',
                'device': '{device}',
                'network': '{network}',
            }
            self.googleadd.set_campaign_url_options(
                agent.client, agent.customer_id,
                agent.campaign_resource_name,
                agent.tracking_template, agent.custom_parameters
            )
            agent.ad_group_resource_name = self.googleadd.create_ad_group(
                agent.client, agent.customer_id,
                agent.campaign_resource_name, 'Test Ad Group',
                agent.client.enums.AdGroupStatusEnum.PAUSED,
                agent.client.enums.AdGroupTypeEnum.DISPLAY_STANDARD
            )

            summary_text = self.ai_recommender.summary_recomend(
                agent.link
            )
            agent.summary = summary_text

            # 2. Generate logo image from that summary
            prompt = (
                "Generate a clear, sharp logo with correct spelling and high visibility, "
                f"based on: {agent.summary}"
            )
            self.ai_recommender.generate_image_from_prompt(
                prompt,
                output_path="logo1.jpeg"
            )
            self.googleadd.resize_image('logo.jpeg', 'square_image.jpeg', (1200,1200))
            self.googleadd.resize_image('logo.jpeg', 'landscape_image.jpeg', (1200,628))
            agent.square_image_asset_resource_name = self.googleadd.create_image_asset(
                agent.client, agent.customer_id,
                'square_image.jpeg', 'Square Marketing Image'
            )
            agent.landscape_image_asset_resource_name = self.googleadd.create_image_asset(
                agent.client, agent.customer_id,
                'landscape_image.jpeg', 'Landscape Marketing Image'
            )
            self.googleadd.create_responsive_display_ad(
                agent.client, agent.customer_id,
                agent.ad_group_resource_name, agent.headlines,
                agent.descriptions, agent.link,
                agent.business_name,
                agent.square_image_asset_resource_name,
                agent.landscape_image_asset_resource_name
            )
            agent.state = 'End'
            agent.response = "Ad setup complete; campaign is live."
            return agent

        # End state or tool handling
        elif agent.state == 'End':
            return agent

        # Tool call handling for budget/campaign
        response_message = response.choices[0].message
        if response_message.content:
            agent.response = response_message.content
        else:
            for call in response_message.tool_calls:
                name = call.function.name
                args = json.loads(call.function.arguments)
                if name == 'create_campaign_budget':
                    agent.budget_amount_micros = args['amount_micros']
                    agent.campaign_budget_resource_name = self.googleadd.create_campaign_budget(
                        agent.client, agent.customer_id,
                        agent.budget_amount_micros, agent.delivery_method
                    )
                    agent.state = 'start_campaign'
                    agent.response = "Budget created; please provide campaign details."
                elif name == 'create_campaign':
                    agent.campaign_name = args['campaign_name']
                    agent.start_date = datetime.date.today().strftime("%Y%m%d")
                    agent.end_date = (datetime.date.today() + datetime.timedelta(days=args['time_duration'])).strftime("%Y%m%d")
                    agent.campaign_resource_name = self.googleadd.create_campaign(
                        agent.client, agent.customer_id,
                        agent.campaign_name, agent.campaign_type,
                        agent.campaign_status, agent.campaign_budget_resource_name,
                        agent.start_date, agent.end_date
                    )
                    self.googleadd.set_network_settings(
                        agent.client, agent.customer_id,
                        agent.campaign_resource_name,
                        target_search=False, target_display=True, target_partner=False
                    )
                    agent.state = 'setting_location_language'
                    agent.response = "Campaign created; proceeding to location and language."
        return agent
