;;; Directory Local Variables
;;; For more information see (info "(emacs) Directory Variables")

((nil . ((eval . (pyvenv-workon "collaborative-todo"))
         (gm-flask-commands-app-name . "app.main")))
 (python-mode . ((fill-column . 120)
                 (eval . (format-all-mode))
                 (format-all-formatters . (("Python" black))))))
