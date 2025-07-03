package api

import (
	"github.com/go-resty/resty/v2"
)

type AuthAPI struct {
	client *resty.Client
}

func NewAuthAPI(client *resty.Client) *AuthAPI {
	return &AuthAPI{
		client: client,
	}
}

func (a *AuthAPI) Login(email, password string) (*resty.Response, error) {
	body := map[string]string{
		"email":    email,
		"password": password,
	}

	resp, err := a.client.R().
		SetBody(body).
		Post("/auth/login")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (a *AuthAPI) Logout() (*resty.Response, error) {
	resp, err := a.client.R().
		Post("/auth/logout")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (a *AuthAPI) Register(email, password, full_name, phone string) (*resty.Response, error) {
	body := map[string]string{
		"email":     email,
		"password":  password,
		"full_name": full_name,
		"phone":     phone,
	}

	resp, err := a.client.R().
		SetBody(body).
		Post("/auth/register")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}
