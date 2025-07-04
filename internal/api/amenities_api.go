package api

import (
	"changeme/internal/client"
	"fmt"
)

type AmenitiesAPI struct {
	client *client.Client
}

func NewAmenitiesAPI(client *client.Client) *AmenitiesAPI {
	return &AmenitiesAPI{
		client: client,
	}
}

func (c *AmenitiesAPI) GetAmenityDetails(amenityID string) (*client.Response, error) {
	return c.client.R().
		SetPathParam("id", amenityID).
		Get("/amenities/{id}")
}

func (c *AmenitiesAPI) GetListAmenities(page int) (*client.Response, error) {
	return c.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page)).
		Get("/amenities")
}

func (c *AmenitiesAPI) CreateAmenity(amenityData map[string]interface{}) (*client.Response, error) {
	return c.client.R().
		SetBody(amenityData).
		Post("/amenities")
}

func (c *AmenitiesAPI) DeleteAmenity(amenityID string) (*client.Response, error) {
	return c.client.R().
		SetPathParam("id", amenityID).
		Delete("/amenities/{id}")
}

func (c *AmenitiesAPI) UpdateAmenity(amenityID string, amenityData map[string]interface{}) (*client.Response, error) {
	return c.client.R().
		SetPathParam("id", amenityID).
		SetBody(amenityData).
		Patch("/amenities/{id}")
}
