defmodule Las.Repo.Migrations.AddRooms do
  use Ecto.Migration

  def change do
    alter table(:rooms) do
     add :user_id, references(:users)
    end
  end
end
