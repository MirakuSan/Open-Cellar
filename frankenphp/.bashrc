# Aliases
alias c=bin/console
alias l="ls -Al"
alias ll="ls -lah"

# Symfony console autocomplete
if ! shopt -oq posix; then
  if [ -f /etc/bash_completion ]; then
    . /etc/bash_completion
  fi
fi

eval "$(/app/bin/console completion bash)"
