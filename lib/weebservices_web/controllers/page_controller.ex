defmodule WeebServicesWeb.PageController do
  use WeebServicesWeb, :controller

  def index(conn, _params) do
    render(conn, "index.html")
  end
end
