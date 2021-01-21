# ShortURL
<strong>ShortURL using express and mongodb</strong><br>
-This is a simple project which uses expressJs and mongoDb to generate the short URL for the given long URL.

Project live on <i>Heroku</i>.

Below steps to test/use the functionality:<br>
<b>Step 1</b>: <br>
Call the API to generate the short URL.<br>
https://shorten-er.herokuapp.com/short/it?longURL=<input long url> <br>


Sample request: <br>
https://shorten-er.herokuapp.com/short/it?longURL=https://javasolution4u.blogspot.com/2020/11/leetcode-problem-longest-substring-solution-in-javascript.html <br>


Sample response: <br>
{"longURL":"https://javasolution4u.blogspot.com/2020/11/leetcode-problem-longest-substring-solution-in-javascript.html","shortURL":"https://shorten-er.herokuapp.com/MD9bRs","createdAt":1611249503,"expiryAt":1611249623,"_id":"6009b761800b2700157652ba"}

<b>Step 2</b>: <br>
View the response of the API called in the step 1, open the short url generated on the browser to redirect to the orginal webpage<br>
