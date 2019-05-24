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
    Please click on the link below to confirm your phone number : {{$phone}}
    <br>

    <a href="http://127.0.0.1:8000/api/verifyPhone/{{$token}}/{{$phone}}">Confirm my phone </a>

    <br/>
</div>
</body>
</html>
