package api

import (
	"changeme/internal/client"
	"fmt"
)

type UserAPI struct {
	client *client.Client
}

func NewUserAPI(client *client.Client) *UserAPI {
	return &UserAPI{
		client: client,
	}
}

func (u *UserAPI) GetUserDetails(userID string) (*client.Response, error) {

	req := u.client.R().
		SetPathParam("userID", userID)

	resp, err := req.Get("/users/{userID}")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (u *UserAPI) GetListUsers(page int, keyword string, order string, status string, gender string, statusAccount string, role string, hasRoom *bool) (*client.Response, error) {
	req := u.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page))

	req.SetQueryParam("keyword", keyword)
	req.SetQueryParam("order", order)
	req.SetQueryParam("status", status)
	req.SetQueryParam("gender", gender)
	req.SetQueryParam("status_account", statusAccount)
	req.SetQueryParam("role", role)
	if hasRoom != nil {
		req.SetQueryParam("has_room", fmt.Sprintf("%t", *hasRoom))
	}

	resp, err := req.Get("/users")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (u *UserAPI) UpdateUserStatus(userID string, statusAccount string) (*client.Response, error) {
	req := u.client.R().
		SetPathParam("id", userID).
		SetBody(map[string]string{
			"status_account": statusAccount,
		})

	resp, err := req.Put("/users/{id}/status-account")

	if err != nil {
		return nil, err
	}

	return resp, nil
}

func (r *UserAPI) AddStudentToRoom(roomID int, userID int) (*client.Response, error) {
	return r.client.R().
		SetPathParam("id", fmt.Sprintf("%d", roomID)).
		SetBody(map[string]interface{}{
			"user_id": userID,
			"room_id": roomID,
		}).
		Post("/users/room")
}
