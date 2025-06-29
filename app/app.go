package app

import (
	"changeme/internal/config"
	"context"
	"fmt"
	"net/http"
)

// App struct
type App struct {
	ctx     context.Context
	client  *http.Client
	token   string
	baseURL string
	config  *config.Config
}

// NewApp creates a new App application struct
func NewApp(config *config.Config) *App {
	return &App{
		client:  &http.Client{},
		token:   "",
		baseURL: config.Client.BaseURL,
		config:  config,
	}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (a *App) Startup(ctx context.Context) {
	a.ctx = ctx
}

// Greet returns a greeting for the given name
func (a *App) Greet(name string) string {
	return fmt.Sprintf("Hello %s, It's show time!", name)
}
