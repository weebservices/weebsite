# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.

# General application configuration
use Mix.Config

# Configures the endpoint
config :weebservices, WeebServicesWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "3MA8G67A3DEcExURISRXayJH1YgQDqRAmo5YLJjjV4y7VFEribIRM8EhT4W6Sy7x",
  render_errors: [view: WeebServicesWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: WeebServices.PubSub, adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Use Jason for JSON parsing in Phoenix
config :phoenix, :json_library, Jason

# Google ReCaptcha
config :recaptcha,
       public: (System.get_env("RECAPTCHA_PUBLIC") || raise "environment variable RECAPTCHA_PUBLIC is missing."),
       private: (System.get_env("RECAPTCHA_PRIVATE") || raise "environment variable RECAPTCHA_PRIVATE is missing.")

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env()}.exs"
