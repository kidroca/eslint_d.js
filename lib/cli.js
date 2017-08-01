/**
 * Created using eslint/lib/cli.js as example
 */

/*
 * The CLI object should *not* call process.exit() directly. It should only return
 * exit codes. This allows other programs to use the CLI object and still control
 * when the program exits.
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const options = require('./options');
const launcher = require('./launcher');
const client = require('./client');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Encapsulates all CLI behavior for eslint. Makes it easier to test as well as
 * for other Node.js programs to effectively run the CLI.
 */
const cli = {

  /**
   * Executes the CLI based on an array of arguments that is passed in.
   * @param {string|Array|Object} args The arguments to process.
   * @param {string} [text] The text to lint (used for TTY).
   * @returns {int} The exit code for the operation.
   */
  execute(args, text) {
    let currentOptions;

    try {
      currentOptions = options.parse(args);
    }
    catch (error) {
      console.error(error.message);
      return 1;
    }

    // const files = currentOptions._;

    if (currentOptions.version) {
      this.version();
    }
    else if (currentOptions.help) {
      this.help();
    }
    else if (currentOptions.start) {
      this.startServer();
    }
    else if (currentOptions.stop) {
      client.stop();
    }
    else if (currentOptions.restart) {
      this.restart();
    }
    else if (currentOptions.status) {
      client.status();
    }
    else {

      if (text) {
        // Parse text from stdin
        return this.lintStdIn(text);
      }
      else {
        return this.lint();
      }
    }

    return 0;
  },

  startServer() {
    launcher();
  },

  restart() {
    const self = this;
    client.stop(() => {
      process.nextTick(() => this.startServer());
    });
  },

  version() {
    console.log('v%s (eslint_d v%s)',
      require('eslint/package.json').version,
      require('../package.json').version);
  },

  help() {
    console.info(options.generateHelp());
  },

  lint() {
    const commandArgs = process.argv.slice(2);
    return client.lint(commandArgs);
  },

  /**
   * Lints the passed text
   * @param {string} text
   */
  lintStdIn(text) {
    const commandArgs = process.argv.slice(2);
    return client.lint(commandArgs, text);
  }
};

module.exports = cli;
