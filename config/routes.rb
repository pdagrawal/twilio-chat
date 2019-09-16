# frozen_string_literal: true

Rails.application.routes.draw do
  root to: 'chats#index'

  resources :chats, only: %i[index show create] do
    get :room_sids, on: :collection
  end

  resources :tokens, only: [:create]
end
