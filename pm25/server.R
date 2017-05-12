library('plumber')

r <- plumb("restapi.R") 

r$run(port=8000)
