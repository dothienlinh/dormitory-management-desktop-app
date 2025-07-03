package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type AmenitiesAPI struct {
	client *resty.Client
}

func NewAmenitiesAPI(client *resty.Client) *AmenitiesAPI {
	return &AmenitiesAPI{
		client: client,
	}
}

func (c *AmenitiesAPI) GetAmenityDetails(amenityID string) (*resty.Response, error) {
	return c.client.R().
		SetPathParam("id", amenityID).
		Get("/amenities/{id}")
}

func (c *AmenitiesAPI) GetListAmenities(page int) (*resty.Response, error) {
	return c.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page)).
		Get("/amenities")
}

func (c *AmenitiesAPI) CreateAmenity(amenityData map[string]interface{}) (*resty.Response, error) {
	return c.client.R().
		SetBody(amenityData).
		Post("/amenities")
}

func (c *AmenitiesAPI) DeleteAmenity(amenityID string) (*resty.Response, error) {
	return c.client.R().
		SetPathParam("id", amenityID).
		Delete("/amenities/{id}")
}

func (c *AmenitiesAPI) UpdateAmenity(amenityID string, amenityData map[string]interface{}) (*resty.Response, error) {
	return c.client.R().
		SetPathParam("id", amenityID).
		SetBody(amenityData).
		Patch("/amenities/{id}")
}
