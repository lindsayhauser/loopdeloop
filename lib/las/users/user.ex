defmodule Las.Users.User do
  use Ecto.Schema
  import Ecto.Changeset


  schema "users" do
    field :admin, :boolean, default: false
    field :email, :string, null: false
    field :first_name, :string
    field :last_name, :string
    field :password_hash, :string
    field :token, :string
    has_many :room, Las.Rooms.Room

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :first_name, :last_name, :password_hash, :admin, :token])
    |> unique_constraint(:email)
    |> validate_required([:email, :first_name, :last_name, :password_hash, :admin])
    |> validate_format(:email, ~r/^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/)
  end
end
