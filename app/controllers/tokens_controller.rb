class TokensController < ApplicationController
  before_action :require_login

  def create
    # Define User Identity
    identity = current_user.email

    # Create Grant for Access Token
    grant = Twilio::JWT::AccessToken::ChatGrant.new
    grant.service_sid = $secret[:twilio][:twilio_chat_service_sid]

    # Create an Access Token
    token = Twilio::JWT::AccessToken.new(
      $secret[:twilio][:twilio_account_sid],
      $secret[:twilio][:twilio_api_key],
      $secret[:twilio][:twilio_api_secret],
      [grant],
      identity: identity
    )

    # Generate the token and send to client
    render json: { identity: identity, token: token.to_jwt }
  end
end
