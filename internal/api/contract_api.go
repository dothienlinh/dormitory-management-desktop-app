package api

import (
	"fmt"

	"github.com/go-resty/resty/v2"
)

type ContractAPI struct {
	client *resty.Client
}

func NewContractAPI(client *resty.Client) *ContractAPI {
	return &ContractAPI{
		client: client,
	}
}

func (c *ContractAPI) GetContractDetails(contractID int) (*resty.Response, error) {
	return c.client.R().
		SetPathParam("id", fmt.Sprintf("%d", contractID)).
		Get("/contracts/{id}")
}

func (c *ContractAPI) GetListContracts(page int, keyword *string) (*resty.Response, error) {
	req := c.client.R().
		SetQueryParam("page", fmt.Sprintf("%d", page))

	if keyword != nil {
		req.SetQueryParam("keyword", *keyword)
	}

	return req.Get("/contracts")
}

func (c *ContractAPI) CreateContract(contractData map[string]interface{}) (*resty.Response, error) {
	return c.client.R().
		SetBody(contractData).
		Post("/contracts")
}
