<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class SendMailable extends Mailable
{
    use Queueable, SerializesModels;
    private $token, $email, $phone;
    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($token, $email, $phone)
    {
        $this->token = $token;
        $this->email = $email;
        $this->phone = $phone;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        if($this->phone){
            return $this->view('phoneVerification', ['token' => $this->token, 'phone' => $this->phone]);
        }
        return $this->view('emailVerification', ['token' => $this->token, 'email' => $this->email]);
    }
}
