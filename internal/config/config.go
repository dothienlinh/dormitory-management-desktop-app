package config

import (
	"os"

	"gopkg.in/yaml.v2"
)

type (
	ClientConfig struct {
		BaseURL string `yaml:"base_url"`
		Timeout int    `yaml:"timeout"`
	}
	LoggerConfig struct {
		Level string `yaml:"level"`
	}
)

type Config struct {
	Client ClientConfig `yaml:"client"`
	Logger LoggerConfig `yaml:"logging"`
}

func LoadConfig() (*Config, error) {
	data, err := os.ReadFile("configs/config.yaml")
	if err != nil {
		return nil, err
	}
	replaced := os.ExpandEnv(string(data))
	cfg := &Config{}
	err = yaml.Unmarshal([]byte(replaced), cfg)
	return cfg, err
}
