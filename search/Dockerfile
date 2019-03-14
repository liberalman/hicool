FROM busybox

EXPOSE 8080

ADD search search
ADD static static
ADD weibo_data.txt weibo_data.txt
ADD dict/dictionary.txt dict/dictionary.txt
ADD dict/stop_tokens.txt dict/stop_tokens.txt

CMD ./search \
 --weibo_data=weibo_data.txt \
 --dict_file=ditc/dictionary.txt \
 --stop_token_file=dict/stop_tokens.txt \
 --static_folder=static
