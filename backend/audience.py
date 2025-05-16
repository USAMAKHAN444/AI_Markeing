from google.ads.googleads.client import GoogleAdsClient
from google.ads.googleads.errors import GoogleAdsException


def set_user_interest_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
                                taxonomy_type: str, search_term: str, segments: list[str]) -> bool:
    """
    Exclude specified user interest segments from a campaign.
    - taxonomy_type: 'AFFINITY' or 'IN_MARKET'
    - search_term: keyword to narrow search of segment names (or None)
    - segments: list of segment names to exclude
    """
    ga_service = client.get_service("GoogleAdsService")
    criterion_service = client.get_service("CampaignCriterionService")
    ops = []
    # Query user_interest constants matching taxonomy_type and optional search_term
    query = (
        f"SELECT user_interest.resource_name, user_interest.name "
        f"FROM user_interest "
        f"WHERE user_interest.taxonomy_type = {taxonomy_type}"
    )
    if search_term:
        safe = search_term.replace("'", "\\'")
        query += f" AND user_interest.name LIKE '%{safe}%'"
    response = ga_service.search_stream(customer_id=customer_id, query=query)
    # Map names to resource_names
    name_to_res = {}
    for batch in response:
        for row in batch.results:
            name_to_res[row.user_interest.name] = row.user_interest.resource_name
    # Build exclusion ops
    for name in segments or []:
        res = name_to_res.get(name)
        if not res:
            continue
        op = client.get_type("CampaignCriterionOperation")
        crit = op.create
        crit.campaign = campaign_resource
        crit.negative = True
        crit.user_interest.user_interest = res
        ops.append(op)
    if not ops:
        return False
    criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
    return True


def set_topic_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
                         topics_search_term: str, topics: list[str]) -> bool:
    """
    Exclude specified topic paths from a campaign.
    - topics_search_term: keyword to narrow topic_constant.path (or None)
    - topics: list of full path strings to exclude
    """
    ga_service = client.get_service("GoogleAdsService")
    criterion_service = client.get_service("CampaignCriterionService")
    ops = []
    # Query topic_constant
    query = "SELECT topic_constant.resource_name, topic_constant.path FROM topic_constant"
    if topics_search_term:
        safe = topics_search_term.replace("'", "\\'")
        query += f" WHERE topic_constant.path CONTAINS '{safe}'"
    response = ga_service.search_stream(customer_id=customer_id, query=query)
    path_to_res = {}
    for batch in response:
        for row in batch.results:
            path = "/".join(row.topic_constant.path)
            path_to_res[path] = row.topic_constant.resource_name
    # Build ops
    for path in topics or []:
        res = path_to_res.get(path)
        if not res:
            continue
        op = client.get_type("CampaignCriterionOperation")
        crit = op.create
        crit.campaign = campaign_resource
        crit.negative = True
        crit.topic.topic_constant = res
        ops.append(op)
    if not ops:
        return False
    criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
    return True


def set_placement_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
                             placements: list[str]) -> bool:
    """Exclude specified placement URLs from a campaign."""
    if not placements:
        return False
    criterion_service = client.get_service("CampaignCriterionService")
    ops = []
    for url in placements:
        op = client.get_type("CampaignCriterionOperation")
        crit = op.create
        crit.campaign = campaign_resource
        crit.negative = True
        crit.placement.url = url
        ops.append(op)
    criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
    return True


def set_demographic_exclusions(client: GoogleAdsClient, customer_id: str, campaign_resource: str,
                               gender_excl: list[str], age_excl: list[str],
                               parental_excl: list[str], income_excl: list[str]) -> bool:
    """
    Exclude demographic categories from a campaign.
    Lists should match enum names or mapped labels.
    """
    criterion_service = client.get_service("CampaignCriterionService")
    enums = client.enums
    ops = []
    # Gender
    for g in gender_excl or []:
        try:
            val = getattr(enums.GenderTypeEnum, g.upper())
        except AttributeError:
            continue
        op = client.get_type("CampaignCriterionOperation")
        crit = op.create
        crit.campaign = campaign_resource
        crit.negative = True
        crit.gender.type = val
        ops.append(op)
    # Age Ranges
    for a in age_excl or []:
        key = a.replace('-', '_').replace('+', 'UP')
        try:
            val = getattr(enums.AgeRangeTypeEnum, f"AGE_RANGE_{key}")
        except AttributeError:
            continue
        op = client.get_type("CampaignCriterionOperation")
        crit = op.create
        crit.campaign = campaign_resource
        crit.negative = True
        crit.age_range.type = val
        ops.append(op)
    # Parental Status
    for p in parental_excl or []:
        key = p.replace(' ', '_').upper()
        try:
            val = getattr(enums.ParentalStatusTypeEnum, f"{key}")
        except AttributeError:
            continue
        op = client.get_type("CampaignCriterionOperation")
        crit = op.create
        crit.campaign = campaign_resource
        crit.negative = True
        crit.parental_status.type = val
        ops.append(op)
    # Income Range
    for inc in income_excl or []:
        key = inc.replace('%','').replace('-', '_')
        try:
            val = getattr(enums.IncomeRangeTypeEnum, f"INCOME_RANGE_{key}")
        except AttributeError:
            continue
        op = client.get_type("CampaignCriterionOperation")
        crit = op.create
        crit.campaign = campaign_resource
        crit.negative = True
        crit.income_range.type = val
        ops.append(op)
    if not ops:
        return False
    criterion_service.mutate_campaign_criteria(customer_id=customer_id, operations=ops)
    return True
