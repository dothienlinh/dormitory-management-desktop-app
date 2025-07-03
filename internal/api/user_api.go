package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type UserAPI struct {
	client *resty.Client
}

func NewUserAPI(client *resty.Client) *UserAPI {
	return &UserAPI{
		client: client,
	}
}

func (u *UserAPI) GetUserDetails(userID string) (*resty.Response, error) {

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

func (u *UserAPI) GetListUsers(page int, keyword *string, order *string, status *string, gender *string) (*resty.Response, error) {
	req := u.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page))

	if keyword != nil {
		req.SetQueryParam("keyword", *keyword)
	}
	if order != nil {
		req.SetQueryParam("order", *order)
	}
	if status != nil {
		req.SetQueryParam("status", *status)
	}
	if gender != nil {
		req.SetQueryParam("gender", *gender)
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
