package api

import (
	"changeme/internal/client"
)

type AuthAPI struct {
	client *client.Client
}

func NewAuthAPI(client *client.Client) *AuthAPI {
	return &AuthAPI{
		client: client,
	}
}

func (a *AuthAPI) Login(email, password string) (*client.Response, error) {
	body := map[string]string{
		"email":    email,
		"password": password,
		"type":     "manager",
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

func (a *AuthAPI) Logout() (*client.Response, error) {
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

func (a *AuthAPI) Register(email, password, full_name, phone string) (*client.Response, error) {
	body := map[string]string{
		"email":     email,
		"password":  password,
		"full_name": full_name,
		"phone":     phone,
		"role":      "staff",
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

func (a *AuthAPI) GetMe() (*client.Response, error) {
	resp, err := a.client.R().
		Get("/auth/me")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (a *AuthAPI) VerifyAccount(token, email string) (*client.Response, error) {
	body := map[string]string{
		"token": token,
		"email": email,
	}

	resp, err := a.client.R().
		SetBody(body).
		Post("/auth/verify-account")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (a *AuthAPI) ResendVerifyAccount(email string) (*client.Response, error) {
	body := map[string]string{
		"email": email,
	}

	resp, err := a.client.R().
		SetBody(body).
		Post("/auth/resend-verify-account")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (a *AuthAPI) SendForgotPasswordEmail(email string) (*client.Response, error) {
	body := map[string]string{
		"email": email,
		"type":  "manager",
	}

	resp, err := a.client.R().
		SetBody(body).
		Post("/auth/forgot-password")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}

func (a *AuthAPI) ResetPassword(body map[string]interface{}) (*client.Response, error) {

	resp, err := a.client.R().
		SetBody(body).
		Post("/auth/reset-password")

	if err != nil {
		return nil, err
	}

	if resp.IsError() {
		return resp, nil
	}

	return resp, nil
}
