# Performance Optimization

The original solution captured the racetrack as a list.
Cheats were found by finding neighbors you could get to within the cheat duration and comparing the positions index to the current one's.

this took around 2 minutes but seemed like the fastest possible approach, so I profiled the solution:

![alt text](<snakeviz_index.png>)

in retrospect, this is obvious, but repeatedly calling `list.index()` has a time complexity of O(n).
The solution spends almost the entire 2 minutes performing the index lookups!

After switching to using a dictionary with keys being track position and values being the index results in a time complexity lookup of O(1). After this minor change and one or two other minor optimizations, the solution dropped to just 2.25 seconds!

![alt text](<snakeviz_dict.png>)

Code Diff