# Use an official Python runtime as a parent image
FROM python:3.10
# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app
# Copy the requirements.txt file into the container at /app
COPY requirements.txt /app/

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir -r requirements.txt
# Copy the current directory contents into the container at /app
COPY . /app/
# Install system packages
RUN apt-get update && apt-get install -y \
    libssl-dev \
    # Add any other necessary system packages here
    && rm -rf /var/lib/apt/lists/*
# Make port 80 available to the world outside this container
EXPOSE 5000

# Define the command to run your Flask application
CMD ["flask", "run", "--host", "0.0.0.0"]