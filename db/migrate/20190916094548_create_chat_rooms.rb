class CreateChatRooms < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_rooms do |t|
      t.string :friendly_name
      t.string :twilio_sid
      t.integer :owner_id

      t.timestamps
    end
  end
end
