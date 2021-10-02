exports.handler = (event, _content, callback) => {
    console.log({ event })
    
    callback(null, {
        statusCode: 200,
        body: JSON.stringify({ boop: true })
    });
}