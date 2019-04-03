Rails.application.routes.draw do
  root to: 'chats#show'

  resources :tokens, only: [:create]
end
