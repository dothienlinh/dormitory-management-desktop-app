package client

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

// Response wraps the standard http.Response with additional functionality to mimic resty.Response
type Response struct {
	Status           string              `json:"Status"`
	StatusCode       int                 `json:"StatusCode"`
	Proto            string              `json:"Proto"`
	ProtoMajor       int                 `json:"ProtoMajor"`
	ProtoMinor       int                 `json:"ProtoMinor"`
	Header           map[string][]string `json:"Header"`
	ContentLength    int64               `json:"ContentLength"`
	TransferEncoding []string            `json:"TransferEncoding"`
	Close            bool                `json:"Close"`
	Uncompressed     bool                `json:"Uncompressed"`
	Trailer          map[string][]string `json:"Trailer"`

	body       []byte
	ParsedBody interface{} `json:"ParsedBody"` // Parsed JSON body for JavaScript consumption
}

// RawBody returns the response body as bytes
func (r *Response) RawBody() []byte {
	return r.body
}

// String returns the response body as string
func (r *Response) String() string {
	return string(r.body)
}

// IsError returns true if the response status code indicates an error
func (r *Response) IsError() bool {
	return r.StatusCode >= 400
}

// Client wraps the standard http.Client with additional functionality to mimic resty.Client
type Client struct {
	httpClient *http.Client
	baseURL    string
	headers    map[string]string
}

// New creates a new HTTP client wrapper that mimics resty.Client
func New() *Client {
	return &Client{
		httpClient: &http.Client{},
		headers:    make(map[string]string),
	}
}

// SetBaseURL sets the base URL for all requests
func (c *Client) SetBaseURL(baseURL string) *Client {
	c.baseURL = strings.TrimSuffix(baseURL, "/")
	return c
}

// SetHeader sets a default header for all requests
func (c *Client) SetHeader(key, value string) *Client {
	c.headers[key] = value
	return c
}

// Request builder for chaining - mimics resty.Request
type RequestBuilder struct {
	client      *Client
	body        interface{}
	headers     map[string]string
	queryParams map[string]string
	pathParams  map[string]string
}

// R creates a new request builder that mimics resty.Client.R()
func (c *Client) R() *RequestBuilder {
	return &RequestBuilder{
		client:      c,
		headers:     make(map[string]string),
		queryParams: make(map[string]string),
		pathParams:  make(map[string]string),
	}
}

// SetHeader sets a header for this request
func (r *RequestBuilder) SetHeader(key, value string) *RequestBuilder {
	r.headers[key] = value
	return r
}

// SetBody sets the request body
func (r *RequestBuilder) SetBody(body interface{}) *RequestBuilder {
	r.body = body
	return r
}

// SetQueryParam sets a query parameter
func (r *RequestBuilder) SetQueryParam(key, value string) *RequestBuilder {
	r.queryParams[key] = value
	return r
}

// SetPathParam sets a path parameter
func (r *RequestBuilder) SetPathParam(key, value string) *RequestBuilder {
	r.pathParams[key] = value
	return r
}

// Get executes a GET request
func (r *RequestBuilder) Get(url string) (*Response, error) {
	return r.client.doRequest(http.MethodGet, url, r.body, r.queryParams, r.pathParams, r.headers)
}

// Post executes a POST request
func (r *RequestBuilder) Post(url string) (*Response, error) {
	return r.client.doRequest(http.MethodPost, url, r.body, r.queryParams, r.pathParams, r.headers)
}

// Put executes a PUT request
func (r *RequestBuilder) Put(url string) (*Response, error) {
	return r.client.doRequest(http.MethodPut, url, r.body, r.queryParams, r.pathParams, r.headers)
}

// Patch executes a PATCH request
func (r *RequestBuilder) Patch(url string) (*Response, error) {
	return r.client.doRequest(http.MethodPatch, url, r.body, r.queryParams, r.pathParams, r.headers)
}

// Delete executes a DELETE request
func (r *RequestBuilder) Delete(url string) (*Response, error) {
	return r.client.doRequest(http.MethodDelete, url, r.body, r.queryParams, r.pathParams, r.headers)
}

// doRequest performs the actual HTTP request
func (c *Client) doRequest(method, urlStr string, body interface{}, queryParams, pathParams, headers map[string]string) (*Response, error) {
	// Build full URL
	fullURL := urlStr
	if !strings.HasPrefix(urlStr, "http") {
		fullURL = c.baseURL + urlStr
	}

	// Replace path parameters
	for key, value := range pathParams {
		fullURL = strings.ReplaceAll(fullURL, "{"+key+"}", value)
	}

	// Parse URL and add query parameters
	parsedURL, err := url.Parse(fullURL)
	if err != nil {
		return nil, fmt.Errorf("invalid URL: %w", err)
	}

	if queryParams != nil {
		q := parsedURL.Query()
		for key, value := range queryParams {
			q.Add(key, value)
		}
		parsedURL.RawQuery = q.Encode()
	}

	// Prepare request body
	var bodyReader io.Reader
	if body != nil {
		bodyBytes, err := json.Marshal(body)
		if err != nil {
			return nil, fmt.Errorf("failed to marshal body: %w", err)
		}
		bodyReader = bytes.NewReader(bodyBytes)
	}

	// Create request
	req, err := http.NewRequestWithContext(context.Background(), method, parsedURL.String(), bodyReader)
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	// Set headers
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	// Set default headers
	for key, value := range c.headers {
		req.Header.Set(key, value)
	}

	// Set request-specific headers
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	// Execute request
	resp, err := c.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("request failed: %w", err)
	}
	defer resp.Body.Close()

	// Read response body
	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response body: %w", err)
	}

	// Parse JSON body if content-type is JSON
	var parsedBody interface{}
	contentType := resp.Header.Get("Content-Type")
	if strings.Contains(contentType, "application/json") && len(respBody) > 0 {
		if err := json.Unmarshal(respBody, &parsedBody); err != nil {
			// If JSON parsing fails, just use the raw string
			parsedBody = string(respBody)
		}
	} else {
		parsedBody = string(respBody)
	}

	return &Response{
		Status:           resp.Status,
		StatusCode:       resp.StatusCode,
		Proto:            resp.Proto,
		ProtoMajor:       resp.ProtoMajor,
		ProtoMinor:       resp.ProtoMinor,
		Header:           resp.Header,
		ContentLength:    resp.ContentLength,
		TransferEncoding: resp.TransferEncoding,
		Close:            resp.Close,
		Uncompressed:     resp.Uncompressed,
		Trailer:          resp.Trailer,
		body:             respBody,
		ParsedBody:       parsedBody,
	}, nil
}
