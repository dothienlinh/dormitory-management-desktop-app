package api

import (
	"changeme/internal/client"
	"fmt"
)

type ContractAPI struct {
	client *client.Client
}

func NewContractAPI(client *client.Client) *ContractAPI {
	return &ContractAPI{
		client: client,
	}
}

func (c *ContractAPI) GetContractDetails(contractID int) (*client.Response, error) {
	return c.client.R().
		SetPathParam("id", fmt.Sprintf("%d", contractID)).
		Get("/contracts/{id}")
}

func (c *ContractAPI) GetListContracts(page int, keyword *string) (*client.Response, error) {
	req := c.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page))

	if keyword != nil {
		req.SetQueryParam("keyword", *keyword)
	}

	return req.Get("/contracts")
}

func (c *ContractAPI) CreateContract(contractData map[string]interface{}) (*client.Response, error) {
	return c.client.R().
		SetBody(contractData).
		Post("/contracts")
}
