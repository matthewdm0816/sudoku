import logging
import os
import sys
from icecream import ic
import colorama
from flask import Flask, request, Response, render_template
from utils import *
from markupsafe import escape
import json
import random
configure_logger()

app = Flask(__name__)

DATA_PATH = "sudoku.data"

def read_sudoku():
    """
    Reads the sudoku from the file and returns it as a list of lists.
    """
    if os.path.exists(DATA_PATH):
        with open(DATA_PATH, "r") as f:
            sudoku = json.load(f)
    else:
        sudoku = {"sudokus": []}
        write_sudoku(sudoku)

    return sudoku

def write_sudoku(sudoku):
    """
    Writes the sudoku to the file.
    """
    with open(DATA_PATH, "w") as f:
        json.dump(sudoku, f)

@app.template_global()
def static_include(filename):
    fullpath = os.path.join(app.static_folder, filename)
    with open(fullpath, 'r') as f:
        return f.read()

def has_sudoku():
    return len(read_sudoku()) > 0

@app.route("/")
@app.route("/index")
def main_page():
    # return "Hello World!"
    return render_template(
        "main.html",
        add_sudoku_path="add_sudoku",
        play_sudoku_path="play_sudoku" if has_sudoku() else None,
    )


@app.route("/add_sudoku")
def add_sudoku():
    return render_template("add_sudoku.html")

@app.route("/submit_sudoku", methods=["POST"])
def submit_sudoku():
    sudoku = request.get_json()
    ic(sudoku)
    # TODO: verify sudoku on server side
    sudokus = read_sudoku()
    sudokus["sudokus"].append(sudoku)
    write_sudoku(sudokus)
    return Response(status=200)

@app.route("/get_sudoku", methods=["GET"])
def get_sudoku():
    sudokus = read_sudoku()
    if len(sudokus["sudokus"]) == 0:
        return Response(status=404)
    # if specified id
    if "id" in request.args:
        sudoku = sudokus["sudokus"][int(request.args["id"])]
    else:
        sudoku = sudokus["sudokus"][random.randint(0, len(sudokus["sudokus"]) - 1)]
    return Response(json.dumps(sudoku), status=200, mimetype="application/json")


@app.route("/play_sudoku")
def play_sudoku():
    return render_template("play_sudoku.html")