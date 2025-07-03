package api

import "github.com/go-resty/resty/v2"

type MaintenanceHistoryAPI struct {
	client *resty.Client
}

func NewMaintenanceHistoryAPI(client *resty.Client) *MaintenanceHistoryAPI {
	return &MaintenanceHistoryAPI{
		client: client,
	}
}

func (m *MaintenanceHistoryAPI) GetMaintenanceHistoryDetails(historyID string) (*resty.Response, error) {
	return m.client.R().
		SetPathParam("id", historyID).
		Get("/maintenance-histories/{id}")
}

func (m *MaintenanceHistoryAPI) GetListMaintenanceHistories(page string, roomID string) (*resty.Response, error) {
	req := m.client.R().
		SetQueryParam("page", page).
		SetQueryParam("room_id", roomID)

	return req.Get("/maintenance-histories")
}

func (m *MaintenanceHistoryAPI) CreateMaintenanceHistory(historyData map[string]interface{}) (*resty.Response, error) {
	return m.client.R().
		SetBody(historyData).
		Post("/maintenance-histories")
}

func (m *MaintenanceHistoryAPI) DeleteMaintenanceHistory(historyID string) (*resty.Response, error) {
	return m.client.R().
		SetPathParam("id", historyID).
		Delete("/maintenance-histories/{id}")
}

func (m *MaintenanceHistoryAPI) UpdateMaintenanceHistory(historyID string, historyData map[string]interface{}) (*resty.Response, error) {
	return m.client.R().
		SetPathParam("id", historyID).
		SetBody(historyData).
		Patch("/maintenance-histories/{id}")
}
