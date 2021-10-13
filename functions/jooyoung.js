exports.handler = async function () {
    // /.netlify/functions/jooyong
    return {
      statusCode: 200,
      body: JSON.stringify({
        name: 'jooyoung',
        age: 10,
        email: 'jooyoung@abc.com'
      })
    }
  }