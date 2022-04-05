import logging
import colorama

def configure_logger():
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    log_format = (
        colorama.Fore.MAGENTA
        + "[%(asctime)s %(name)s %(levelname)s] "
        + colorama.Fore.WHITE
        + "%(message)s"
    )
    logging.basicConfig(format=log_format, level=logging.INFO, datefmt="%I:%M:%S")
    logger.info("Starting Server...")