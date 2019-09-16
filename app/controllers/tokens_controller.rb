class TokensController < ApplicationController
  before_action :require_login

  def create
    # Define User Identity
    identity = current_user.email

    # Create Grant for Access Token
    grant = Twilio::JWT::AccessToken::ChatGrant.new
    grant.service_sid = $secret[:twilio][:chat_service_sid]

    # Create an Access Token
    token = Twilio::JWT::AccessToken.new(
      $secret[:twilio][:account_sid],
      $secret[:twilio][:api_key],
      $secret[:twilio][:api_secret],
      [grant],
      identity: identity
    )

    # Generate the token and send to client
    render json: { identity: identity, token: token.to_jwt }
  end
end
