package client

import (
	"bytes"
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
)

const (
	defaultBaseURL = "https://jsonplaceholder.typicode.com/"
)

type HTTPClient struct {
	client  *http.Client
	BaseURL *url.URL
}

// Initialize a new HTTP client
func NewHTTPClient(baseClient *http.Client) *HTTPClient {
	if baseClient == nil {
		baseClient = &http.Client{}
	}

	baseURL, _ := url.Parse(defaultBaseURL)

	return &HTTPClient{
		client:  baseClient,
		BaseURL: baseURL,
	}
}

// Create a new HTTP request
func (c *HTTPClient) NewRequest(method, urlStr string, body any) (*http.Request, error) {
	if !strings.HasSuffix(c.BaseURL.Path, "/") {
		return nil, fmt.Errorf("BaseURL must have a trailing slash, but %q does not", c.BaseURL)
	}

	u, err := c.BaseURL.Parse(urlStr)
	if err != nil {
		return nil, err
	}

	var buf io.ReadWriter
	if body != nil {
		buf = &bytes.Buffer{}
		err := json.NewEncoder(buf).Encode(body)
		if err != nil {
			return nil, err
		}
	}

	req, err := http.NewRequest(method, u.String(), buf)
	if err != nil {
		return nil, err
	}

	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	return req, nil
}

// Execute the HTTP request
func (c *HTTPClient) Do(ctx context.Context, req *http.Request, v any) (*http.Response, error) {
	if ctx == nil {
		return nil, errors.New("context must be non-nil")
	}

	req = req.WithContext(ctx)

	resp, err := c.client.Do(req)
	if err != nil {
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		default:
		}

		return nil, err
	}
	defer resp.Body.Close()

	err = CheckResponse(resp)
	if err != nil {
		return resp, err
	}

	switch v := v.(type) {
	case nil:
	case io.Writer:
		_, err = io.Copy(v, resp.Body)
	default:
		decErr := json.NewDecoder(resp.Body).Decode(v)
		if decErr == io.EOF {
			decErr = nil // Ignore EOF errors caused by empty response body
		}
		if decErr != nil {
			err = decErr
		}
	}

	return resp, err
}

// Check if the HTTP response indicates an error
func CheckResponse(resp *http.Response) error {
	if c := resp.StatusCode; 200 <= c && c <= 299 {
		return nil
	}

	return fmt.Errorf("%s %s: %s", resp.Request.Method, resp.Request.URL, resp.Status)
}

// BlogPost represents a blog post entity
type BlogPost struct {
	ID     int64  `json:"id"`
	Title  string `json:"title"`
	Body   string `json:"body"`
	UserID int64  `json:"userId"`
}

// Fetch a blog post by ID
func (c *HTTPClient) GetBlogPost(ctx context.Context, id int64) (*BlogPost, *http.Response, error) {
	u := fmt.Sprintf("posts/%d", id)

	req, err := c.NewRequest(http.MethodGet, u, nil)
	if err != nil {
		return nil, nil, err
	}

	b := new(BlogPost)
	resp, err := c.Do(ctx, req, b)
	if err != nil {
		return nil, nil, err
	}
	defer resp.Body.Close()

	return b, resp, nil
}

func (c *HTTPClient) PutJSON(myUrl string, jsonData []byte) (string, error) {
	req, err := http.NewRequest(http.MethodPut, myUrl, bytes.NewBuffer(jsonData))
	if err != nil {
		return "", fmt.Errorf("error creating PUT request: %w", err)
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := c.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error making PUT request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %w", err)
	}

	return string(body), nil
}

func (c *HTTPClient) Delete(myUrl string) (string, error) {
	req, err := http.NewRequest(http.MethodDelete, myUrl, nil)
	if err != nil {
		return "", fmt.Errorf("error creating DELETE request: %w", err)
	}

	resp, err := c.client.Do(req)
	if err != nil {
		return "", fmt.Errorf("error making DELETE request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %w", err)
	}

	return string(body), nil
}
