<?php

$inputuser = uname;
$inputpass = psw;
$input = "july18";
if($inputpass == $input)
{
	header("location: homepage.html");
}
else
{
	header("location: fail.php");
}

?>