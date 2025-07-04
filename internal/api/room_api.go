package api

import (
	"changeme/internal/client"
	"fmt"
)

type RoomAPI struct {
	client *client.Client
}

func NewRoomAPI(client *client.Client) *RoomAPI {
	return &RoomAPI{
		client: client,
	}
}

func (r *RoomAPI) GetRoomDetails(roomID int) (*client.Response, error) {
	return r.client.R().
		SetPathParam("id", fmt.Sprintf("%d", roomID)).
		Get("/rooms/{id}")
}

func (r *RoomAPI) GetListRooms(page int) (*client.Response, error) {
	return r.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page)).
		Get("/rooms")
}

func (r *RoomAPI) CreateRoom(roomData map[string]interface{}) (*client.Response, error) {
	return r.client.R().
		SetBody(roomData).
		Post("/rooms")
}

func (r *RoomAPI) DeleteRoom(roomID int) (*client.Response, error) {
	return r.client.R().
		SetPathParam("id", fmt.Sprintf("%d", roomID)).
		Delete("/rooms/{id}")
}

func (r *RoomAPI) UpdateRoom(roomID int, roomData map[string]interface{}) (*client.Response, error) {
	return r.client.R().
		SetPathParam("id", fmt.Sprintf("%d", roomID)).
		SetBody(roomData).
		Patch("/rooms/{id}")
}
