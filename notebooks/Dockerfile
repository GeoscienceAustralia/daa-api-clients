# Start from a core stack version
FROM jupyter/minimal-notebook
# Install requirements
COPY requirements.txt /home/jovyan/requirements.txt
RUN pip install --quiet --no-cache-dir -r requirements.txt && rm /home/jovyan/requirements.txt
COPY ./notebooks/IderDown.ipynb /home/jovyan
