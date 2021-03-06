defmodule Las.Repo.Migrations.CreateUsers do
  use Ecto.Migration

  def change do
    create table(:users) do
      add :email, :string, null: false
      add :first_name, :string
      add :last_name, :string
      add :password_hash, :string
      add :admin, :boolean, default: false, null: false
      add :token, :string

      timestamps()
    end

    create index(:users, [:email], unique: true)

  end
end
