package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type RoomAPI struct {
	client *resty.Client
}

func NewRoomAPI(client *resty.Client) *RoomAPI {
	return &RoomAPI{
		client: client,
	}
}

func (r *RoomAPI) GetRoomDetails(roomID int) (*resty.Response, error) {
	return r.client.R().
		SetPathParam("id", fmt.Sprintf("%d", roomID)).
		Get("/rooms/{id}")
}

func (r *RoomAPI) GetListRooms(page int) (*resty.Response, error) {
	return r.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page)).
		Get("/rooms")
}

func (r *RoomAPI) CreateRoom(roomData map[string]interface{}) (*resty.Response, error) {
	return r.client.R().
		SetBody(roomData).
		Post("/rooms")
}

func (r *RoomAPI) DeleteRoom(roomID int) (*resty.Response, error) {
	return r.client.R().
		SetPathParam("id", fmt.Sprintf("%d", roomID)).
		Delete("/rooms/{id}")
}

func (r *RoomAPI) UpdateRoom(roomID int, roomData map[string]interface{}) (*resty.Response, error) {
	return r.client.R().
		SetPathParam("id", fmt.Sprintf("%d", roomID)).
		SetBody(roomData).
		Patch("/rooms/{id}")
}
