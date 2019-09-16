# frozen_string_literal: true

class ChatRoom < ApplicationRecord
  belongs_to :owner, class_name: 'User', foreign_key: 'owner_id'
end
