<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice - #123</title>

    <style type="text/css">
        @page {
            margin: 0px;
        }
        body {
            margin: 0px;
        }
        * {
            font-family: Verdana, Arial, sans-serif;
        }
        a {
            color: #fff;
            text-decoration: none;
        }
        table {
            font-size: x-small;
        }
        tfoot tr td {
            font-weight: bold;
            font-size: x-small;
        }
        .invoice table {
            margin: 15px;
        }
        .invoice h3 {
            margin-left: 15px;
        }
        .information {
            background-color: #27ab27;
            color: #FFF;
        }
        .information .logo {
            margin: 5px;
        }
        .information table {
            padding: 10px;
        }
    </style>

</head>
<body>

<div class="information">
    <table width="100%">
        <tr>
            <td align="left" style="width: 40%;">
                <h3>Premium Product Invoice</h3>
                <pre>
{{$name}}
<br /><br />
Status: Paid
</pre>


            </td>

            <td align="right" style="width: 40%;">

                <pre>
                    https://barbarkost.com

                    Jakarta Barat
                    Indonesia
                </pre>
            </td>
        </tr>

    </table>
</div>


<br/>

<div class="invoice">
    <h3>Premium Product Transaction</h3>
    <table width="100%">
        <thead>
        <tr>
            <th>Invoice</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Price</th>

        </tr>
        </thead>
        <tbody>
        <tr>
            <td>{{$invoice}}</td>
            <td>{{$start_date}}</td>
            <td>{{$end_date}}</td>
            <td>{{$price}}</td>
        </tr>

        </tbody>
    </table>
</div>

<div class="information" style="position: absolute; bottom: 0; width: 100%">
    <table width="100%">
        <tr>
            <td align="right" style="width: 50%;">
                BarBar Kost
            </td>
        </tr>

    </table>
</div>
</body>
</html>