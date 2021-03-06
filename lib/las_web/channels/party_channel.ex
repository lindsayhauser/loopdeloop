# Referenced http://www.ccs.neu.edu/home/ntuck/courses/2018/09/cs4550/notes/06-channels/notes.html
defmodule LasWeb.GamesChannel do
  use LasWeb, :channel

  alias Las.Party
  alias Las.PartyServer
  alias Las.RoomUsers

  def join("Welcome! Party Room:" <> game, payload, socket) do
    if authorized?(payload) do
      socket = assign(socket, :game, game)
      PartyServer.set_party_name(game, socket.assigns[:user].id)
      PartyServer.add_user(game, socket.assigns[:user].id)
      view = PartyServer.view(game, socket.assigns[:user])

      {:ok, %{"join" => game, "view" => view}, socket}
    else
      {:error, %{reason: "unauthorized"}}
      end
    end

  def handle_in("toggle", %{}, socket) do
    view = PartyServer.toggle(socket.assigns[:game], socket.assigns[:user])
    broadcast(socket, "change_view", view)
    {:reply, {:ok, %{ "view" => view}}, socket}
  end

  def handle_in("current_song", %{"track" => s, "image" => i}, socket) do
    view = PartyServer.current_song(socket.assigns[:game], socket.assigns[:user], s, i)
    broadcast(socket, "change_view", view)
    {:reply, {:ok, %{ "view" => view}}, socket}
  end

    # Add other actions here

  # It is also common to receive messages from the client and
  # broadcast to everyone in the current topic (games:lobby).
  def handle_in("shout", payload, socket) do
    broadcast socket, "shout", payload
    {:noreply, socket}
  end

  # Authorization logic here as required.
  defp authorized?(payload) do
    user_id = Map.get(payload, "user")
    room_id = Map.get(payload, "room")

    if user_id != nil and room_id != nil do
      roomuser = RoomUsers.room_contains_user(user_id, room_id)
      if roomuser do
        true
      end
    else
      false
    end
  end
end
