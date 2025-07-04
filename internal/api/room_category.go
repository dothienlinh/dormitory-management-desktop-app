package api

import (
	"changeme/internal/client"
)

type RoomCategoryAPI struct {
	client *client.Client
}

func NewRoomCategoryAPI(client *client.Client) *RoomCategoryAPI {
	return &RoomCategoryAPI{
		client: client,
	}
}

func (r *RoomCategoryAPI) GetRoomCategoryDetails(categoryID string) (*client.Response, error) {
	return r.client.R().
		SetPathParam("id", categoryID).
		Get("/room-categories/{id}")
}

func (r *RoomCategoryAPI) GetListRoomCategories(page string) (*client.Response, error) {
	return r.client.R().
		SetQueryParam("page", (page)).
		Get("/room-categories")
}

func (r *RoomCategoryAPI) CreateRoomCategory(categoryData map[string]interface{}) (*client.Response, error) {
	return r.client.R().
		SetBody(categoryData).
		Post("/room-categories")
}
