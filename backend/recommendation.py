from langchain.chains.summarize import load_summarize_chain
from langchain_community.document_loaders import AsyncHtmlLoader
from langchain_community.document_transformers import Html2TextTransformer
from groq import Groq
import json
from langchain.schema import Document
from langchain_groq import ChatGroq
import pathlib
from google import genai
from google.genai import types

class AI_Recommendation:

    def __init__(self, api_key):
        self.api_key = api_key

    def fetch_website_content(self, urls):
        loader = AsyncHtmlLoader(urls)
        docs = loader.load()
        html2text = Html2TextTransformer()
        docs_transformed = html2text.transform_documents(docs)

        all_text = " ".join(doc.page_content for doc in docs_transformed)
        return all_text



    def recommend_campaign_elements(self, link):
        website_text = self.fetch_website_content(link)
        client = Groq(api_key=self.api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are an advanced language model specializing in analyzing website content and recommending
        the best Google Ads campaign elements (Business Name, Headlines, Descriptions, Long Headlines) based on web content.

        Instructions:
        - Analyze the content of the website to understand the type of audience, products/services, and their behavior patterns.
        - Based on this analysis, generate:
          1. A **Business Name** BusinessName will be consist of less than 20character (could be the actual name of the business or a brand name).
          2. A list of **10 unique Headlines (will be consist of max 3words)** based on the website content.
          3. A list of **10 unique Descriptions (will be consist of max 6words)** based on the website content.
          4. A list of **10 unique Long Headlines (will be consist of max 8words)** based on the website content.

        Generate a output according to provided Json Output Format:
        Follow this format same avoid extra text

        {{
          "business_name": "[BusinessName will be consist of less than 20character]",
          "headlines": [
            "Headline1 will be consist of max 3words",
            "Headline2 will be consist of max 3words",
            "Headline3 will be consist of max 3words",
            "Headline4 will be consist of max 3words",
            "Headline5 will be consist of max 3words",

          ],
          "long_headlines": [
            "LongHeadline1 will be consist of max 8words",
            "LongHeadline2 will be consist of max 8words",
            "LongHeadline3 will be consist of max 8words",
            "LongHeadline4 will be consist of max 8words",
            "LongHeadline5 will be consist of max 8words",

          ],
          "descriptions": [
            "Description1 will be consist of max 6words",
            "Description2 will be consist of max 6words",
            "Description3 will be consist of max 6words",
            "Description4 will be consist of max 6words",
            "Description5 will be consist of max 6words",

          ]
        }}
                    """
                },
                {
                    "role": "user",
                    "content": f"""here is Website Content:{website_text}""",
                },
            ],
            model="llama3-70b-8192",
            temperature=0,
            # Streaming is not supported in JSON mode
            stream=False,
            # Enable JSON mode by setting the response format
            response_format={"type": "json_object"},
        )
        return json.loads(chat_completion.choices[0].message.content)





    def recommend_schedules_device(self, link, locations):
        website_text = self.fetch_website_content(link)


        client = Groq(api_key=self.api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are an advanced language model specializing in analyzing website content and audience behavior
        to recommend optimal ad schedules for Google Ads campaigns and also recommending
        the best devices for Google Ads campaigns based on user behavior, content type, and location-specific insights.. Your task is to:

        1. Use the provided website content and target locations to analyze audience activity patterns.
        2. Recommend the best day(s) and time slot(s) for running ads based on:
          - The website's focus and audience behavior.
          - Time zones and cultural preferences of the provided locations.



        Instructions:
        - Recommend a schedule that maximizes ad effectiveness based on the audience's behavior.
        - Ensure time slots are relevant to the time zones of the provided locations.
        - Output the schedule in the specified format and avoid additional explanations.
        - Consider the geographical regions provided in the location data and how the audience in these regions typically engages with the website content.
        - Suggest the best devices to target based on the combination of website content and user preferences in those locations.
        - For example, if the audience is in mobile-centric regions or markets, recommend prioritizing mobile devices, while if the website is desktop-heavy or business-oriented, recommend targeting desktop devices.
        - The output should include devices that align with both the content type and geographical preferences.
        Kindly following the json format to generate a json output
        Follow this format same "DAY" ,"START_HOUR","END_HOUR" without leaving this and also avoid extra text
        Kindly generate a output according to following format in JSON Output Format:
        Dont need to add any irrelevant text
        Json Output Format:
         ['ad_schedule':
            {
                "day_of_week": 'provide the day monday,tuesday,wednessday,thursday,friday,saturday,sunday',
                "start_hour": 'int digit no value will be between 1,2 etc',
                "end_hour": 'init digit no value will be 1, 2 etc',

            },

            so on ... maximum seven are required and dont exceed this and less than seven or seven,

            'device': ['write best device name here Tablet', 'Mobile', 'Desktop', choose the minimum one and maximum 3 only ]
        ]
        """
                },
                {
                    "role": "user",
                    "content": f"""here is Website Content:{website_text} and here is Target Locations: {locations}""",
                },
            ],
            model="llama3-70b-8192",
            temperature=0,
            # Streaming is not supported in JSON mode
            stream=False,
            # Enable JSON mode by setting the response format
            response_format={"type": "json_object"},
        )
        return json.loads(chat_completion.choices[0].message.content)



    def recommend_locations(self, link):
        website_text = self.fetch_website_content(link)

        client = Groq(api_key=self.api_key)
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are an advanced language model specializing in analyzing website content to recommend
        the best target locations for Google Ads campaigns and language in json format output. Your task is to:

        1. Analyze the website's content to determine its primary focus or target audience.
        2. Recommend geographical locations (in a Google Ads-compatible format) where the website's
          content is likely to perform best based on the content and language.
        3. Ensure to provide a mix of global and local locations, based on the services mentioned on the website.

        4. Ensure that all recommended locations correspond to the language of the website content
          (e.g., if the content is in Urdu, use "ur"; if in English, use "en"; if in Japanese, use "ja".......etc.).
        5. Only include locations where the primary or significant audience speaks the language of the content.
        6. The language code must match the website content language and should not include irrelevant codes.

        Instructions:
        - Analyze the text to identify key topics, services, or products.
        - Recommend geographic locations or cities relevant to the content's target audience based on language and market relevance.
        - Only include locations where the language of the content is commonly spoken or understood.
        - Do not include any locations with language codes that do not match the content language.

        Kindly generate a output according to following format in JSON Output Format:

        Json Output Format:
         {'locations' : [["Location1", "write language here format 'ur', 'en' etc", ["Location2", "write language here format 'ur', 'en' etc"] ... top 10 location just and dont exceed this limit]
        'language' : ["Language full complate name English, Urdu etc just one language name"]}

                    """
                },
                {
                    "role": "user",
                    "content": f"""here is Website Content:{website_text}""",
                },
            ],
            model="llama3-70b-8192",
            temperature=0,
            # Streaming is not supported in JSON mode
            stream=False,
            # Enable JSON mode by setting the response format
            response_format={"type": "json_object"},
        )
        return json.loads(chat_completion.choices[0].message.content)

    def recommend_audience(self, link):
        '''
        Analyze website content to recommend audience targeting criteria for Google Ads Display campaigns.
        Output a JSON object with these keys (use null for missing search terms, empty arrays for no exclusions):
          - taxonomy_type: one of ['AFFINITY', 'IN_MARKET']
          - audience_search_term: string or null
          - segments: list of strings (audience segment names to exclude)
          - topics_search_term: string or null
          - topics: list of strings (topic path strings to exclude)
          - placement_exclusions: list of full URL strings
          - gender_exclusions: list from ['Male', 'Female', 'Undetermined', 'Unknown']
          - age_range_exclusions: list from ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']
          - parental_status_exclusions: list from ['Parent', 'Not a parent', 'Undetermined']
          - income_range_exclusions: list from ['0-50%', '50-60%', '60-70%', '70-80%', '80-90%', '90%+']

        Valid values example (for guidance):
          taxonomy_type: 'IN_MARKET'
          gender_exclusions: ['Male', 'Female']
          age_range_exclusions: ['25-34', '35-44']
          parental_status_exclusions: ['Not a parent']
          income_range_exclusions: ['70-80%', '80-90%']
        '''
        website_text = self.fetch_website_content(link)
        client = Groq(api_key=self.api_key)
        system_prompt = (
            'You are an expert system that extracts and selects audience targeting criteria from given website content for a Google Ads Display campaign. '
            'Select only from the following valid options when populating the JSON fields:\n'
            '- taxonomy_type: AFFINITY or IN_MARKET\n'
            '- audience_search_term: any keyword string or null if none\n'
            '- segments: list of audience segment names to exclude\n'
            '- topics_search_term: any keyword string or null if none\n'
            '- topics: list of topic path strings to exclude\n'
            '- placement_exclusions: list of full URL strings to exclude\n'
            '- gender_exclusions: any subset of [Male, Female, Undetermined, Unknown]\n'
            '- age_range_exclusions: any subset of [18-24, 25-34, 35-44, 45-54, 55-64, 65+]\n'
            '- parental_status_exclusions: any subset of [Parent, Not a parent, Undetermined]\n'
            '- income_range_exclusions: any subset of [0-50%, 50-60%, 60-70%, 70-80%, 80-90%, 90%+]\n'
            'Respond strictly with a JSON object containing exactly these keys: taxonomy_type, audience_search_term, segments, topics_search_term, topics, placement_exclusions \n'
            'gender_exclusions, age_range_exclusions, parental_status_exclusions, income_range_exclusions. Use null for search terms if no filter is needed, and empty lists if no exclusions.\n'
            'Do not include any other keys or explanatory text.'
        )
        chat_completion = client.chat.completions.create(
            messages=[
                {'role': 'system', 'content': system_prompt},
                {'role': 'user', 'content': f'Website Content: {website_text}'},
            ],
            model='llama3-70b-8192',
            temperature=0,
            stream=False,
            response_format={'type': 'json_object'},
        )
        return json.loads(chat_completion.choices[0].message.content)

    # def summary_recomend(self, link):
    #     # 1. Fetch web content
    #     website_text = self.fetch_website_content(link)
    #
    #     # 2. Wrap in a Document so LangChain can consume it
    #     docs = [Document(page_content=website_text)]
    #
    #     # 3. Generate summary with ChatGroq
    #     llm = ChatGroq(
    #         model="llama3-groq-70b-8192-tool-use-preview",
    #         temperature=0,
    #         max_tokens=1024,
    #         api_key="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"
    #     )
    #     summarizer = load_summarize_chain(
    #         llm=llm,
    #         chain_type="stuff",
    #         verbose=False
    #     )
    #     # pass list of docs, not a raw string
    #     summary_text = summarizer.run(docs)
    #     return summary_text

    def summary_recomend(self, link):
        # 1. Fetch web content
        website_text = self.fetch_website_content(link)
        # --- 2. Summarize via Groq.chat without JSON mode ---
        client = Groq(api_key=self.api_key)
        system_prompt = (
            "You are an expert summarizer. "
            "Summarize the following text in NO MORE than 25 words, capturing only the key points. "
            "Respond with plain text only."
        )
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": website_text},
            ],
            model="llama3-70b-8192",  # replace with supported model
            temperature=0,
            stream=False
        )
        return chat_completion.choices[0].message.content.strip()

    def generate_image_from_prompt(self, prompt: str, output_path: str = "generated_image.png") -> None:

        client = genai.Client(api_key="AIzaSyDlywYYcNq-ofCA97f7nts734F5_-HDSIU")
        MODEL_ID = "gemini-2.0-flash-exp"
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=types.GenerateContentConfig(
            response_modalities=['Text', 'Image'])
        )
        # save first image
        for part in response.candidates[0].content.parts:
            if part.inline_data:
                pathlib.Path(output_path).write_bytes(part.inline_data.data)
                print(f"Image saved to {output_path}")
                break
