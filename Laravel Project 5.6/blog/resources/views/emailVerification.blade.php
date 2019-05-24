<!doctype html>
<head>
    <style>
        a {
            color: #636b6f;
            padding: 0 25px;
            font-size: 12px;
            font-weight: 600;
            letter-spacing: .1rem;
            text-decoration: none;
            text-transform: uppercase;
        }
    </style>
</head>
<body>
<div>
    Hi !
    <br>
    Thank you for joining BarBarKos!
    <br>
    Please click on the link below to confirm your email address
    <br>

    <a href="http://127.0.0.1:8000/api/verifyEmail/{{$token}}/{{$email}}">Confirm my email address </a>

    <br/>
</div>
</body>
</html>
