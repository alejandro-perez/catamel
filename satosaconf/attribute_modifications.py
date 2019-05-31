import re

from .base import ResponseMicroService
from ..exception import SATOSAAuthenticationError

class AddStaticAttributes(ResponseMicroService):
    """
    Add static attributes to the responses.
    """

    def __init__(self, config, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.static_attributes = config["static_attributes"]

    def process(self, context, data):
        data.attributes.update(self.static_attributes)
        return super().process(context, data)


class FilterAttributeValues(ResponseMicroService):
    """
    Filter attribute values, only preserving those matching the given regex.
    """

    def __init__(self, config, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.attribute_filters = config["attribute_filters"]

    def process(self, context, data):
        # apply default filters
        provider_filters = self.attribute_filters.get("", {})
        self._apply_requester_filters(data.attributes, provider_filters, data.requester)

        # apply target provider specific filters
        target_provider = data.auth_info.issuer
        provider_filters = self.attribute_filters.get(target_provider, {})
        self._apply_requester_filters(data.attributes, provider_filters, data.requester)
        return super().process(context, data)

    def _apply_requester_filters(self, attributes, provider_filters, requester):
        # apply default requester filters
        default_requester_filters = provider_filters.get("", {})
        self._apply_filter(attributes, default_requester_filters)

        # apply requester specific filters
        requester_filters = provider_filters.get(requester, {})
        self._apply_filter(attributes, requester_filters)

    def _apply_filter(self, attributes, attribute_filters):
        for attribute_name, attribute_filter in attribute_filters.items():
            regex = re.compile(attribute_filter)
            if attribute_name == "":  # default filter for all attributes
                for attribute, values in attributes.items():
                    attributes[attribute] = list(filter(regex.search, attributes[attribute]))
            elif attribute_name in attributes:
                attributes[attribute_name] = list(filter(regex.search, attributes[attribute_name]))


class DuoMapping(ResponseMicroService):
    """
    Replaces the value of an attribute with the result of an REST API call
    """
    def __init__(self, config, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.attribute_name = config["attribute_name"]
        self.url = config["url"]
        self.authtoken = config["authtoken"]

    def perform_request(self, oldvalue):
        """
        Perform the REST API request to the mapping service and return the new
        value. If the mapping fails, return None
        """
        import requests
        r = requests.get('{}?username={}'.format(self.url, oldvalue),
                         headers={'Authorization': self.authtoken})
        response = r.json()
        return response["localname"]

    def process(self, context, data):
        if self.attribute_name in data.attributes:
            try:
                new_value = self.perform_request(data.attributes[self.attribute_name])
            except Exception as ex:
                raise SATOSAAuthenticationError(context.state, "DUO mapping failed!")
            data.attributes[self.attribute_name] = new_value
        return super().process(context, data)

