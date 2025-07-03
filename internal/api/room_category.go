package api

import (
	"github.com/go-resty/resty/v2"
)

type RoomCategoryAPI struct {
	client *resty.Client
}

func NewRoomCategoryAPI(client *resty.Client) *RoomCategoryAPI {
	return &RoomCategoryAPI{
		client: client,
	}
}

func (r *RoomCategoryAPI) GetRoomCategoryDetails(categoryID string) (*resty.Response, error) {
	return r.client.R().
		SetPathParam("id", categoryID).
		Get("/room-categories/{id}")
}

func (r *RoomCategoryAPI) GetListRoomCategories(page string) (*resty.Response, error) {
	return r.client.R().
		SetQueryParam("page", (page)).
		Get("/room-categories")
}

func (r *RoomCategoryAPI) CreateRoomCategory(categoryData map[string]interface{}) (*resty.Response, error) {
	return r.client.R().
		SetBody(categoryData).
		Post("/room-categories")
}
