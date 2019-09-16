# frozen_string_literal: true

class ChatsController < ApplicationController
  before_action :require_login
  before_action :find_room, only: [:show]

  def index
    @rooms = ChatRoom.all
    @room = ChatRoom.new
  end

  def create
    ChatRoom.create(friendly_name: params[:friendly_name],
                    owner_id: current_user.id,
                    twilio_sid: params[:twilio_sid])
    render json: {}
  end

  def show; end

  def room_sids
    room_sids = ChatRoom.pluck(:twilio_sid)
    render json: { room_sids: room_sids }
  end

  private

  def find_room
    @room = ChatRoom.find(params[:id])
  end
end
