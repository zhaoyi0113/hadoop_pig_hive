install.packages("plumber")
install.packages("lubridate")
install.packages("ggplot2")
library('plumber')
library('ggplot2')

r <- plumb("restapi.R") 

r$run(port=8000)
